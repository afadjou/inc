<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class NotesListRestResource
 *
 * Module de traitement pour une demande de la liste des relevés de notes.
 *
 * @Action (
 *   id = "action.plugin_id.notes_list",
 *   label = @Translation("Module de traitement pour une demande de la liste des relevés de notes."),
 * )
 */
class NotesListRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $rn = [];
    if ($request['uid']) {
      $rn = Drupal::database()->query(
        "select
      pifd.id,
      pfrex.field_releve_examen_value type,
      pfrss.field_releve_session_value session,
      pfrs.field_releve_serie_target_id serial,
      tfds.name serial_name,
      ttfst.field_series_tag_value serial_tag,
      pfrc.field_releve_centre_target_id center,
      tfdc.name center_name,
      pfrsc.field_releve_sous_centre_target_id scenter,
      tfdsc.name scenter_name,
      pfrnt.field_releve_numero_table_value n_table,
      pfrd.field_releve_deliberation_value deliberation_date
      from {paragraphs_item_field_data} pifd " .
        "inner join paragraph__field_releve_centre pfrc on pifd.id = pfrc.entity_id " .
        "inner join paragraph__field_releve_sous_centre pfrsc on pifd.id = pfrsc.entity_id " .
        "inner join paragraph__field_releve_serie pfrs on pifd.id = pfrs.entity_id " .
        "inner join paragraph__field_releve_deliberation pfrd on pifd.id = pfrd.entity_id " .
        "inner join paragraph__field_releve_etudiant pfre on pifd.id = pfre.entity_id " .
        "inner join paragraph__field_releve_examen pfrex on pifd.id = pfrex.entity_id " .
        "inner join paragraph__field_releve_numero_table pfrnt on pifd.id = pfrnt.entity_id " .
        "inner join paragraph__field_releve_session pfrss on pifd.id = pfrss.entity_id " .
        "inner join taxonomy_term_field_data tfds on pfrs.field_releve_serie_target_id = tfds.tid " .
        "inner join taxonomy_term_field_data tfdc on pfrc.field_releve_centre_target_id = tfdc.tid " .
        "inner join taxonomy_term_field_data tfdsc on pfrsc.field_releve_sous_centre_target_id = tfdsc.tid " .
        "inner join taxonomy_term__field_series_tag ttfst on tfds.tid = ttfst.entity_id " .
        "where (pifd.type = 'paragraph_releve_notes' and pfre.field_releve_etudiant_target_id = " . $request['uid'] . ")"
      )->fetchAll();
    }
    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($rn))
    ];
  }
}
