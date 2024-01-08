<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class UpdateNoteRestResource
 *
 * Module de traitement pour une demande de maj d'une note.
 *
 * @Action (
 *   id = "action.plugin_id.update_note",
 *   label = @Translation("Module de traitement pour une demande de maj d'une note."),
 * )
 */
class UpdateNoteRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $result = Drupal::database()->query("update {paragraph__field_note_note}
            set field_note_note_value = " . $request['data']['note'].
            " where(bundle = 'paragraph_notes' and entity_id = " . $request['data']['id'] . ")")->execute();
      if ($result) {
        return [
          'code' => 200,
          'data' => $result
        ];
      }
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
