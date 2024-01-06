<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class AdresseModel.
 */
class AdresseModel {

  /**
   * N° et nom de la rue.
   *
   * @var string
   *
   * @drupalField field_adresse_num_rue_voie
   */
  public string $rue = '';
  /**
   * Complément adresse.
   *
   * @var string
   * @drupalField field_adresse_complement
   */
  public string $complement = '';
  /**
   * Code postal.
   *
   * @var string
   * @drupalField field_adresse_code_postal
   */
  public string $codePostal = '';
  /**
   * Ville.
   *
   * @var Drupal\inc_rest\Rest\Entity\TaxonomyModel
   *
   * @drupalField taxonomy.villes.field_adresse_ville
   */
  public $ville;
  /**
   * Pays.
   *
   * @var Drupal\inc_rest\Rest\Entity\TaxonomyModel
   *
   * @drupalField taxonomy.villes.field_adresse_pays
   */
  public $pays;
  /**
   * Adresse active.
   *
   * @var bool
   * @drupalField field_adresse_active
   */
  public bool $active = true;
}
