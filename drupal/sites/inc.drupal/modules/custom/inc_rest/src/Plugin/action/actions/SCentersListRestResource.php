<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class SCentersListRestResource
 *
 * Module de traitement pour une demande de la liste des sous centres.
 *
 * @Action (
 *   id = "action.plugin_id.scenters",
 *   label = @Translation("Module de traitement pour une demande de la liste des sous centres."),
 * )
 */
class SCentersListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $centers = Drupal::database()->query(
      "select ttfd.tid, ttfd.vid, ttfd.name
      from {taxonomy_term_field_data} ttfd where(ttfd.vid = 'sous_centres')"
    )->fetchAll();

    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($centers))
    ];
  }
}
