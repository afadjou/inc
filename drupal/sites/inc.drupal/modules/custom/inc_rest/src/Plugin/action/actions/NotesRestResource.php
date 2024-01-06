<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class NotesRestResource
 *
 * Module de traitement pour une demande de la liste des notes sur un relevé
 *
 * @Action (
 *   id = "action.plugin_id.notes",
 *   label = @Translation("Module de traitement pour une demande de la liste des notes sur un relevé."),
 * )
 */
class NotesRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    $notes = [];
    if (!empty($request['rnid'])) {
      $notes = Drupal::database()->query(
        "select
        pifd.id,
        pfnm.field_note_matiere_target_id matter,
        pfnn.field_note_note_value note
      from {paragraphs_item_field_data} pifd " .
        "inner join paragraph__field_note_matiere pfnm on pifd.id = pfnm.entity_id " .
        "inner join paragraph__field_note_note pfnn on pifd.id = pfnn.entity_id " .
        "inner join paragraph__field_note_releve pfnr on pifd.id = pfnr.entity_id " .
        "where (pifd.type = 'paragraph_notes' and pfnr.field_note_releve_target_id = " . $request['rnid'] . ")"
      )->fetchAll();


    }

    return [
      'code' => 200,
      'list' => Json::decode(Json::encode($notes))
    ];
  }
}
