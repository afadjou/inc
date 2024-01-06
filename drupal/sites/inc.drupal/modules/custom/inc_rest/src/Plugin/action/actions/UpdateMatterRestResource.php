<?php

namespace Drupal\inc_rest\Plugin\action\actions;

use Drupal;
use Drupal\Core\Session\AccountProxyInterface;

/**
 * class UpdateMatterRestResource
 *
 * Module de traitement pour une demande de mise à jour de matière.
 *
 * @Action (
 *   id = "action.plugin_id.update_matter",
 *   label = @Translation("Module de traitement pour une demande de mise à jour de matière."),
 * )
 */
class UpdateMatterRestResource extends ActionResourceBase {

  public function apply(array $request, AccountProxyInterface $accountProxy): array
  {
    if (!empty($request['data'])) {
      $data = $request['data'];
      $matter = Drupal::entityTypeManager()->getStorage('paragraph')->load($data['id']);
      if (!empty($matter)) {
        foreach ($data as $key => $value) {
          switch ($key) {
            case 'coef':
            case 'created':
              $matter->set('field_matiere_coef', $value);
              break;
            default:
              // TODO les autres champs ne sont plus modifiables.
              break;
          }
        }
        $matter->save();
        return [
          'data' => $matter
        ];
      } else {
        return [
          'code' => 200,
          'data' => t('La valeur [%v] du champ [%c] ne correspond à aucune matière.', ['%c' => 'id', '%v' => $data['id']])
        ];
      }

    }

    return [
      'code' => 200,
      'data' => t('La clé %c du flux est vide', ['%c' => 'data'])
    ];
  }
}
