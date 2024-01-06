<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class SerialsListRestResource
 *
 * Module de traitement pour une demande de la liste des séries.
 *
 * @Action (
 *   id = "action.plugin_id.series",
 *   label = @Translation("Module de traitement pour une demande de la liste des séries."),
 * )
 */
class SerialsListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $centers = Drupal::database()->query(
      "select ttfd.tid id, ttfd.name label
      from {taxonomy_term_field_data} ttfd where(ttfd.vid = 'series')"
    )->fetchAll();

    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($centers))
    ];
  }
}
