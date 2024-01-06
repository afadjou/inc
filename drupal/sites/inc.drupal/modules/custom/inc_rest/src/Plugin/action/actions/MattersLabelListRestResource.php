<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class MattersLabelListRestResource
 *
 * Module de traitement pour une demande de la liste des libelés pour les matières.
 *
 * @Action (
 *   id = "action.plugin_id.matters_labels",
 *   label = @Translation("Module de traitement pour une demande de la liste des libelés pour les matières."),
 * )
 */
class MattersLabelListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $centers = Drupal::database()->query(
      "select ttfd.tid id, ttfd.name label
      from {taxonomy_term_field_data} ttfd where(ttfd.vid = 'matieres')"
    )->fetchAll();

    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($centers))
    ];
  }
}
