<?php

namespace Drupal\inc_rest\Plugin\rest\validation;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Class ValidationPluginManager
 *
 * @package Drupal\inc_rest\Plugin\rest\validation
 */
class ValidationPluginManager extends DefaultPluginManager {
  /**
   * WsValidator constructor.
   *
   * @param \Traversable $namespaces
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct('Plugin/rest/validation', $namespaces, $module_handler, 'Drupal\inc_rest\Plugin\rest\validation\ValidationPluginInterface', 'Drupal\inc_rest\Annotation\Validation');
    $this->alterInfo('inc_rest');
    $this->setCacheBackend($cache_backend, 'inc_cachebackend_validation');
  }

}
