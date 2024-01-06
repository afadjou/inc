<?php
namespace Drupal\inc_rest\Service;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Entity\EntityInterface;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginManager;
use stdClass;

/**
 * Class AnnotationService.
 *
 * @package Drupal\inc_rest\Service
 */
class RestService {
  protected ValidationPluginManager $_pluginManager;
  /**
   * Prefix of class.
   *
   * @var string
   */
  protected $classPrefix = 'inc-';

  public function __construct(ValidationPluginManager $validationPluginManager) {
    $this->_pluginManager = $validationPluginManager;
  }
  /**
   * Serialize object from specify object class.
   *
   * @param object $object
   *   Object need serialize.
   * @param object $result
   *   Serialize result.
   * @param string $parentCssClass
   *   Name of parent css class.
   * @param bool $internalData
   *   Montrer les attributs non publics.
   * @param array $context
   */
  public function serializeFromClass($object, &$result, $parentCssClass = '', bool $internalData = FALSE, array $context = []) {

    $reflectionClass = new \ReflectionObject($object);

    $properties = $reflectionClass->getProperties();

    foreach ($properties as $property) {
      $name = $property->getName();
      $value = property_exists($object, $name) ? $object->$name : NULL;

      preg_match_all('/\*\s+([^@\* ].*)/m', $property->getDocComment(), $comment);
      preg_match_all('/@var\s+(\S+)/m', $property->getDocComment(), $var);
      preg_match_all('/@rest\s+(\S+)\s+(\S+)\s+(\S+)/m', $property->getDocComment(), $restrictions);

      if ($property->isPublic()) {
        if (!empty($comment[1])) {
          $result->$name['description'] = $comment[1][0];
        }

        $result->$name['class'] = $property->class;
        if ($restrictions !== FALSE && !empty($restrictions[1]) && !empty($restrictions[2]) && !empty($restrictions[3])) {

          // Restriction column name.
          $restColName = [
            'category',
            'type',
            'value',
          ];

          $restriction = [];
          unset($restrictions[0]);
          foreach (array_values($restrictions) as $iRest => $rests) {
            foreach ($rests as $nbRest => $rest) {
              $restriction[$nbRest][$restColName[$iRest]] = $rest;
            }
          }
          $result->$name['restriction'] = $restriction;
        }

        if (!empty($var[1])) {
          $type = $var[1][0];
          $result->$name['type'] = $type;
          $availableTypes = [
            'string',
            'int',
            'float',
            'bool',
            'array'
          ];

          // Bool if it's special property case.
          $specialProperty = FALSE;
          if (!empty($parentCssClass)) {
            $result->$name['css-class'] = $parentCssClass . '-' . $name;
          }
          else {
            $result->$name['css-class'] = $this->classPrefix . $name;
          }

          if (gettype($object->$name) == 'array') {
            $result->$name['css-class'] .= '-[num' . ucfirst($name) . ']';
          }

          if (!empty($result->$name['restriction'])) {
            $result->$name['css-class-value'] = [];
            foreach ($result->$name['restriction'] as $restriction) {
              if ($restriction['type'] === 'enumeration') {
                $restrictionPrefixClass = $specialProperty ? str_replace('__[' . $name . ']', '', $result->$name['css-class']) : $result->$name['css-class'];
                $result->$name['css-class-value'][] = $restrictionPrefixClass . '__' . $restriction['value'];
              }
            }
          }

          if (!in_array($type, $availableTypes)) {
            try {
              // Get default value type if array is empty.
              if ($type != 'array' && empty($value) && is_array($value)) {
                $value = [new $type()];
              }

              if (gettype($object->$name) == 'array') {
                if (!is_array($value)) {
                  $value = [$value];
                }
                foreach ($value as $val) {
                  $newObject = new $type();
                  $val = new stdClass();
                  $this->serializeFromClass($newObject, $val, $result->$name['css-class'], $internalData, $context);
                  $result->$name['children'][] = $val;
                }
              }
              else {
                $newObject = new $type();
                $value = new stdClass();
                $this->serializeFromClass($newObject, $value, $result->$name['css-class'], $internalData, $context);
                $result->$name['children'] = $value;
              }
            }
            catch (\Exception $e) {
              $result->$name = $value;
            }
          }
        }
        /*
         * Champs optionnels.
         */
        preg_match_all('/@optional\s+([A-Za-z0-9_ ].*)/m', $property->getDocComment(), $actions);
        if (!empty($actions[1])) {
          $optional = array_unique(array_filter(array_map('trim', $actions[1])));
          $optional = reset($optional);
          $result->$name['optional'] = ($optional === 'TRUE') ? TRUE : FALSE;
        }

        /**
         * Teneur de comparaison
         */
        preg_match_all('/@strict\s+([A-Za-z0-9_ ].*)/m', $property->getDocComment(), $actions);
        if (!empty($actions[1])) {
          $strict = array_unique(array_filter(array_map('trim', $actions[1])));
          $strict = reset($strict);
          $result->$name['strict'] = ($strict === 'TRUE') ? TRUE : FALSE;
        }
        if ($internalData) {
          // Mapping des champs Drupal.
          preg_match_all('/@drupalField\s+([A-Za-z0-9_ ].*)/m', $property->getDocComment(), $drupalField);

          if (!empty($drupalField[1][0])) {
            $result->$name['drupal_field'] = $drupalField[1][0];
          }

          // Mapping des champs Drupal.
          preg_match_all('/@drupalFields\s+([A-Za-z0-9_ ].*)/m', $property->getDocComment(), $drupalFields);

          if (!empty($drupalFields[1])) {
            $result->$name['drupal_fields'] = $drupalFields[1];
          }

          // Callback de vérification des restrictions.
          if (isset($result->$name['restriction'])) {
            if (in_array('restriction', array_column($result->$name['restriction'], 'category'))) {
              $result->$name['validate'][] = [
                'plugin' => 'ws_validator_restriction',
                'method' => 'validate',
              ];
            }
          }

          /*
           * Ajout de validate par plugin pour chaque champ.
           */
          preg_match_all('#@wsvalidator\s+([A-Za-z0-9_ ]+)#m', $property->getDocComment(), $validators);
          if (!empty($validators[1])) {
            foreach ($validators[1] as $validator) {
              [$plugin, $method, $required] = explode(' ', $validator);
              $result->$name['validate'][] = [
                'plugin' => $plugin,
                'method' => $method,
                'required' => $required // value in 'any', 'false' or 'true'. Checked if field need to be required
              ];
            }
          }

          /*
           * Ajout de appel générique des plugins.
           */
          preg_match_all('#@plugin\s+([A-Za-z0-9_ ]+)#m', $property->getDocComment(), $plugins);
          if (!empty($plugins[1])) {
            foreach ($plugins[1] as $pluginItem) {
              [$plugin, $method] = explode(' ', $pluginItem);
              $result->$name['plugins'][] = [
                'plugin' => $plugin,
                'method' => $method,
              ];
            }
          }

          /*
           * Ajout de appel presave.
           */
          preg_match_all('#@presave\s+([A-Za-z0-9_ ]+)#m', $property->getDocComment(), $plugins);
          if (!empty($plugins[1])) {
            foreach ($plugins[1] as $pluginItem) {
              [$plugin, $method] = explode(' ', $pluginItem);
              $result->$name['presave_plugins'][] = [
                'plugin' => $plugin,
                'method' => $method,
              ];
            }
          }

          /*
           * Ajout de "states".
           */
          preg_match_all('#@wsstates\s+([A-Za-z0-9_ ]+)#m', $property->getDocComment(), $states);
          if (!empty($states[1])) {
            foreach ($states[1] as $state) {
              [$plugin, $method, $field, $value] = explode(' ', $state);
              if (!empty($field)) {
                $result->$name['ws_states'][] = ['plugin' => $plugin, 'method' => $method, 'field' => $field, 'value' => $value];
              } else {
                $result->$name['ws_states'] = [
                  'plugin' => $plugin,
                  'method' => $method,
                ];
              }
            }
          }
          else {
            preg_match_all('/@states\s+([A-Za-z].*)\s+([A-Za-z0-9_.].*)\s+([A-Za-z].*)/m', $property->getDocComment(), $states);

            if (!empty($states[1])) {
              foreach ($states[1] as $key => $type) {
                if (!empty($states[2][$key]) && !empty($states[3][$key])) {
                  $result->$name['states'][] = [
                    'type' => $type,
                    'field' => $states[2][$key],
                    'value' => $states[3][$key],
                  ];
                }
              }
            }
          }

          preg_match_all('#@notempty#m', $property->getDocComment(), $notEmpty);
          if (!empty($notEmpty[0][0])) {
            $result->$name['not_empty'] = TRUE;
          }

          // Key annotation
          preg_match_all('#@key\s+([A-Za-z0-9_ ]+)#m', $property->getDocComment(), $keys);
          if (isset($keys[1][0])) {
            $result->$name['key'] = $keys[1][0];
          }
        }
      }

      preg_match_all('/@var\s+([^\s]+)/m', $property->getDocComment(), $var);
    }
  }

  /**
   * Assigne les valeur des champs.
   *
   * @param array $values
   * @param $fields
   * @param EntityInterface $entity
   * @return void
   * @throws \Drupal\Component\Plugin\Exception\PluginException
   */
  public function setValues(array &$values, $fields, EntityInterface $entity) {
    foreach ($fields as $fieldName => $fieldInfo) {
      // Lecture de la valeur
      if (!empty($field = $fieldInfo['drupal_field'])) {
        if (empty($fieldInfo['children'])) {
          $values[$fieldName] = NULL;
          if (method_exists($entity, 'hasField') && $entity->hasField($field)) {
            $values[$fieldName] = $entity->get($field)->getString();
          } elseif(method_exists($entity, 'get')) {
            $values[$fieldName] = $entity->get($fieldName);
          }
          if (!empty($fieldInfo['plugins'])) {
            $this->applyPlugin($values, $fieldInfo, $fieldName, $entity);
          }
        } else {
          [$entityType, $bundle, $entityField] = explode('.', $field);
          if (method_exists($entity, 'hasField') && $entity->hasField($entityField)) {
            $fieldEntity = $entity->get($entityField);
            if (method_exists($fieldEntity, 'referencedEntities')) {
              $target_entities = array_values($fieldEntity->referencedEntities());
              if (!empty($target_entities)) {
                if (is_array($fieldInfo['children'])) {
                  foreach ($target_entities as $key => $target_entity) {
                    $child = reset($fieldInfo['children']);
                    if (!empty($child)) {
                      $values[$fieldName][$key] = [];
                      $this->setValues($values[$fieldName][$key], $child, $target_entity);
                    }
                  }
                } else {
                  if (!empty($target_entity = $target_entities[0])) {
                    $values[$fieldName] = [];
                    $this->setValues($values[$fieldName], $fieldInfo['children'], $target_entity);
                  }
                }
              }
            } else {
              $values[$fieldName] = $entity->get($fieldName)->getString();
              $this->applyPlugin($values, $fieldInfo, $fieldName, $entity);
            }
          }
        }
      }
    }
  }

  /**
   * Inject les données du request dans les entités.
   *
   * @param $fields
   * @param array $request
   * @param EntityInterface $entity
   * @param EntityInterface|NULL $entity_parent
   * @param string $field_parent
   * @return void
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function inputValues(array &$values, $fields, array $request, EntityInterface $entity, EntityInterface $entity_parent = NULL, string $field_parent = '') {
    foreach ($fields as $fieldName => $fieldInfo) {
      // Lecture de la valeur
      if (!empty($field = $fieldInfo['drupal_field'])) {
        if (empty($fieldInfo['children'])) {
          if (isset($request[$fieldName])) {
            $values[$field] = $request[$fieldName];
            if (method_exists($entity, 'hasField') && $entity->hasField($field)) {
              $entity->set($field, $values[$field]);
            } elseif (method_exists($entity, 'get')) {
              $entity->set($field, $values[$field]);
            }
            if (!empty($fieldInfo['presave_plugins'])) {
              $this->presavePlugin($entity, $values[$field], $fieldInfo, $fieldName, $request);
            }
          }
        } else {
          [$entityType, $bundle, $entityField] = explode('.', $field);
          if (method_exists($entity, 'hasField') && $entity->hasField($entityField)) {
            $fieldEntity = $entity->get($entityField);
            if (method_exists($fieldEntity, 'referencedEntities')) {
              $target_entities = array_values($fieldEntity->referencedEntities());
              if (!empty($target_entities)) {
                if (is_array($fieldInfo['children'])) {
                  foreach ($fieldInfo['children'] as $key => $child) {
                    if (!empty($target_entity = $target_entities[$key])) {
                      if (!empty($request[$fieldName])) {
                        $values[$field] = [];
                        $this->inputValues($values[$field], $child, $request[$fieldName], $target_entity, $entity, $entityField);
                        if (!empty($fieldInfo['presave_plugins'])) {
                          $this->presavePlugin($entity,$values[$field], $fieldInfo, $fieldName, $request);
                        }
                      }
                    }
                  }
                } else {
                  if (!empty($target_entity = $target_entities[0])) {
                    if (!empty($request[$fieldName])) {
                      $values[$field] = [];
                      $this->inputValues($values[$field], $fieldInfo['children'], $request[$fieldName], $target_entity, $entity, $entityField);
                      if (!empty($fieldInfo['presave_plugins'])) {
                        $this->presavePlugin($entity, $values[$field], $fieldInfo, $fieldName, $request);
                      }
                    }
                  }
                }
              }
            } else {
              $values[$field] = $request[$fieldName];
              $entity->set($field, $values[$field]);
              if (!empty($fieldInfo['presave_plugins'])) {
                $this->presavePlugin($entity,$values[$field], $fieldInfo, $fieldName, $request);
              }
            }
          }
        }
      }
    }

    // Save entity
    $entity->save();
    if (!empty($entity_parent) && $entity_parent->hasField($field_parent)) {
      // $entity_parent->set($field_parent, $entity->id());
      // $entity_parent->save();
      // $values[$field_parent] = $entity->getEntityTypeId();
    }
  }


  /**
   * Appel traitement par plugin.
   *
   * @param array $values
   * @param array $fieldInfo
   * @param $fieldName
   * @param $entity
   * @return void
   * @throws \Drupal\Component\Plugin\Exception\PluginException
   */
  protected function applyPlugin(array &$values, array $fieldInfo, $fieldName, $entity) {
    foreach ($fieldInfo['plugins'] as $config) {
      if ($this->_pluginManager->hasDefinition($config['plugin'])) {
        $plugin = $this->_pluginManager->createInstance($config['plugin'], ['entity' => $entity]);
        if (method_exists($plugin, $config['method'])) {
          $values[$fieldName] = $plugin->{$config['method']}($values[$fieldName]);
        }
      }
    }
  }

  /**
   * Traitement des plugin traitant du presave.
   *
   * @param array $value
   * @param array $fieldInfo
   * @param $entity
   * @return void
   * @throws \Drupal\Component\Plugin\Exception\PluginException
   */
  protected function presavePlugin(&$entity, &$value, array $fieldInfo, $fieldName, $request) {
    [$entityType, $bundle, $drupalField] = explode('.', $fieldInfo['drupal_field']);
    foreach ($fieldInfo['presave_plugins'] as $config) {
      if ($this->_pluginManager->hasDefinition($config['plugin'])) {
        $plugin = $this->_pluginManager->createInstance($config['plugin'], []);
        if (method_exists($plugin, $config['method'])) {
          $plugin->{$config['method']}($entity, $value, $fieldName, $drupalField, $request);
        }
      }
    }
  }
}
