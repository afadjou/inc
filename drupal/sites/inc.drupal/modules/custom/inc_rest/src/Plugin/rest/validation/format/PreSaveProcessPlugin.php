<?php

namespace Drupal\inc_rest\Plugin\rest\validation\format;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\file\Entity\File;
use Drupal\inc_rest\Plugin\action\ActionPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginBase;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginInterface;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginManager;
use Drupal\inc_rest\Rest\Entity\UserModel;
use EasyRdf\Exception;
use stdClass;

/**
 * class PreSaveProcessPlugin
 *
 * Module de traitement pour une demande de connexion.
 *
 * @Validation (
 *   id = "presave_process_plugin",
 *   label = @Translation("Module de pre-traitement des données avant sauvegarde."),
 * )
 */
class PreSaveProcessPlugin extends ValidationPluginBase {

  /**
   * Convertir la date du format d/m/YYYY en timestamp
   *
   * @param $value
   * @return string
   */
  public function date(&$entity, &$value, string $fieldName, $drupalField, array $request = NULL)
  {
    $date = \DateTime::createFromFormat('d/m/Y', $value);
    if (!empty($date)) {
      $value = $date->getTimestamp();
      if ($entity->hasField($drupalField)) {
        $entity->set($drupalField, $value);
      }
    }
  }

  /**
   * Format la date à partir du format d/m/Y.
   *
   * @param string $value
   * @return string
   */
  public function dateEn(&$entity, &$value, string $fieldName, $drupalField, array $request = NULL) {
    $date = \DateTime::createFromFormat('d/m/Y', $value);
    if (!empty($date)) {
      $value = $date->format('Y-m-d');
      if ($entity->hasField($drupalField)) {
        $entity->set($drupalField, $value);
      }
    }
  }

  /**
   * Convertit un uri en url.
   *<
   * @param string $value
   */
  public function contentToFile(&$entity, &$value, string $fieldName, $drupalField, array $request = NULL) {
    $data = $request[$fieldName];
    if (!empty($data['content']) && !empty($data['fid'])) {
      $dirName = 'public://pictures/' . date('YYYY-m');
      if (Drupal::service('file_system')->prepareDirectory($dirName, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
        $fileName = $dirName . '/' . $data['filename'];
        file_put_contents($fileName, file_get_contents($data['content']));
        if (file_exists($fileName)) {
          $newFile = File::create([
            'filename' => $data['filename'],
            'uri' => $fileName
          ]);

          try {
            $newFile->save();
            if ($entity->hasField($drupalField)) {
              $file = Drupal::entityTypeManager()->getStorage('file')->load($data['fid']);
              if (!empty($file)) {
                $file->delete();
              }
              $entity->set($drupalField, $newFile->id());
            }
          } catch (Exception $exc) {}
        }
      }
    }
  }

  /**
   * Affecte les roles sélectionnées.
   *
   * @param $entity
   * @param $value
   * @param string $fieldName
   * @param $drupalField
   * @param array|NULL $request
   * @return void
   */
  public function roles(&$entity, &$value, string $fieldName, $drupalField, array $request = NULL) {
    if (!empty($request)) {
      $roles = array_column($request[$fieldName], 'id');
      if ($entity->hasfield($drupalField)) {
        $entity->set($drupalField, $roles);
      }
    }
  }
}
