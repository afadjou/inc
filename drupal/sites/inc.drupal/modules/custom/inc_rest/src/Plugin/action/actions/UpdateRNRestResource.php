<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * class UpdateRNRestResource
 *
 * Module de traitement pour une demande de maj de relevés de notes.
 *
 * @Action (
 *   id = "action.plugin_id.update_rn",
 *   label = @Translation("Module de traitement pour une demande de maj de relevé de notes."),
 * )
 */
class UpdateRNRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $rn = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['id']);
      if (!empty($rn)) {
        // Traitement de la date
        $dates = explode('/', $data['deliberation_date']);
        if (count($dates) === 3) {
          $delib_date = DrupalDateTime::createFromFormat('Y/m/d', $data['deliberation_date']);
          if (!$delib_date->hasErrors()) {
            $data['deliberation_date'] = $delib_date->format('Y-m-d');
          }
        }

        $rn->set('field_releve_centre', $data['center']);
        $rn->set('field_releve_sous_centre', $data['scenter']);
        $rn->set('field_releve_serie', $data['serial']);
        $rn->set('field_releve_numero_table', $data['n_table']);
        $rn->set('field_releve_session', $data['session']);
        $rn->set('field_releve_examen', $data['type']);
        $rn->set('field_releve_deliberation', $data['deliberation_date']);

        $rn->save();
        return [
          'code' => 200,
          'data' => $rn->id()
        ];
      }
    }
    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
