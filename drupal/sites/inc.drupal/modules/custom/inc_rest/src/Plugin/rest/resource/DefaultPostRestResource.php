<?php

namespace Drupal\inc_rest\Plugin\rest\resource;

use Drupal;
use Drupal\Component\Plugin\Exception\PluginException;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\inc_rest\Plugin\action\ActionPluginManager;
use Drupal\inc_rest\Service\RestService;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\Plugin\Type\ResourcePluginManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "default_post_rest_resource",
 *   label = @Translation("Default post rest resource"),
 *   uri_paths = {
 *     "create" = "/api/v1/post"
 *   }
 * )
 */
class DefaultPostRestResource extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var AccountProxyInterface
   */
  protected $currentUser;

  protected ActionPluginManager $_pluginManager;
  protected RestService $_restService;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    $instance = parent::create($container, $configuration, $plugin_id, $plugin_definition);
    $instance->logger = $container->get('logger.factory')->get('inc_rest');
    $instance->currentUser = $container->get('current_user');
    $instance->_pluginManager = $container->get('inc_rest.manager.plugin');
    $instance->_restService = $container->get('inc_rest.service');
    return $instance;
  }

  /**
   * Responds to POST requests.
   *
   * @param mixed $payload
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   * @throws PluginException
   *   Throws exception expected.
   */
  public function post() {
    $request = Json::decode(Drupal::request()->getContent());

    // You must to implement the logic of your REST Resource here.
    // Use current user after pass authentication to validate access.
    if (!$this->currentUser->hasPermission('restful post default_rest_resource')) {
      return new ModifiedResourceResponse([
        'errorCode' => 404,
        'message' => $this->t('Votre identifiant ou mot de passe est incorrect.'),
        'user' => $this->currentUser->id()
      ], 404);
    }

    $plugin_id = 'action.plugin_id.' . $request['action'];
    if ($this->_pluginManager->hasDefinition($plugin_id)) {
      try {
        $plugin = $this->_pluginManager->createInstance($plugin_id, [
          'rest_service' => $this->_restService
        ]);

        if (!empty($plugin)) {
          $response = $plugin->apply($request, $this->currentUser);
        } else {
          $response = [
            'code' => 500,
            'message' => t('Erreur de chargement du plugin avec l\'ID [%id].', ['%id' => $plugin_id])
          ];
        }
      } catch (\ErrorException $exc) {
        return new ModifiedResourceResponse(['code' => $exc->getCode(), 'message' => $exc->getMessage()], $exc->getCode());
      }

    } else {
      $response = [
        'code' => 404,
        'message' => t('L\'action [' . $request['action'] . '] demandée n\'existe pas.')
      ];
    }

    $response['code'] = $response['code'] ?? 200;
    return new ModifiedResourceResponse($response, $response['code']);
  }

  /**
   * @return array
   */
  public function permissions()
  {
    return [];
  }
}
