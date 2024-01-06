<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal\inc_rest\Plugin\action\ActionPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Service\RestService;

/**
 * class ActionResourceBase
 */
abstract class ActionResourceBase implements ActionPluginInterface {
  protected RestService $_restService;
  protected array $_values = [];

  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    $this->_restService = $configuration['rest_service'];
  }
  public abstract function apply(array $request, AccountProxyInterface $accountProxy): array;
  public function getPluginId()
  {
    // TODO: Implement getPluginId() method.
  }

  public function getPluginDefinition()
  {
    // TODO: Implement getPluginDefinition() method.
  }
}
