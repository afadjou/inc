<?php

namespace Drupal\inc_rest\Plugin\action;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;

/**
 * Class ActionPluginManager
 *
 * @package Drupal\inc_rest\Plugin\action
 */
class ActionPluginManager extends DefaultPluginManager {
  /**
   * WsValidator constructor.
   *
   * @param \Traversable $namespaces
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct('Plugin/action', $namespaces, $module_handler, 'Drupal\inc_rest\Plugin\action\ActionPluginInterface', 'Drupal\inc_rest\Annotation\Action');
    $this->alterInfo('inc_rest');
    $this->setCacheBackend($cache_backend, 'inc_cachebackend_actions');
  }

}
