<?php

namespace Drupal\inc_rest\Plugin\rest\validation\format;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\inc_rest\Plugin\action\ActionPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginBase;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginInterface;
use Drupal\inc_rest\Plugin\rest\validation\ValidationPluginManager;
use Drupal\inc_rest\Rest\Entity\UserModel;
use stdClass;

/**
 * class FormatPlugin
 *
 * Module de traitement pour formattage des données.
 *
 * @Validation (
 *   id = "validation_data_format",
 *   label = @Translation("Module de traitement pour formattage des données."),
 * )
 */
class FormatPlugin extends ValidationPluginBase {

  /**
   * Formate la date à partir d'un timestamp
   *
   * @param $value
   * @return string
   */
  public function date($value)
  {
    return date('d/m/Y', $value);
  }

  /**
   * Format la date à partir du format YYYY-MM-DD.
   *
   * @param string $value
   * @return string
   */
  public function dateFr(string $value) {
    return date('d/m/Y', strtotime($value));
  }

  /**
   * Convertit un uri en url.
   *<
   * @param string $value
   */
  public function url(string $value) {
    return Drupal::service('file_url_generator')->generateAbsoluteString($value);
  }
}
