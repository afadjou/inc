<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class MattersListRestResource
 *
 * Module de traitement pour une demande de la liste des matières
 *
 * @Action (
 *   id = "action.plugin_id.matters",
 *   label = @Translation("Module de traitement pour une demande de la liste des matières."),
 * )
 */
class MattersListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $matters = Drupal::database()->query(
      "select
        pifd.id,
        pifd.created,
        tfdm.name label,
        tfdm.tid mid,
        pfms.field_matiere_serie_target_id serial,
        pfmc.field_matiere_coef_value coef
      from {paragraphs_item_field_data} pifd " .
      "inner join paragraph__field_matiere_libelle pfml on pifd.id = pfml.entity_id " .
      "inner join paragraph__field_matiere_serie pfms on pifd.id = pfms.entity_id " .
      "inner join paragraph__field_matiere_coef pfmc on pifd.id = pfmc.entity_id " .
      "inner join taxonomy_term_field_data tfdm on pfml.field_matiere_libelle_target_id = tfdm.tid " .
      "where (pifd.type = 'paragraph_matieres')"
    )->fetchAll();

    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($matters))
    ];
  }
}
