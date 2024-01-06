<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class CiviliteModel.
 */
class IdentiteModel {

  /**
   * Civilité.
   *
   * @var string
   *
   * @drupalField field_identite_civilite
   */
  public string $civilite = '';
  /**
   * Nom d'usage.
   *
   * @var string
   * @drupalField field_identite_nom_usage
   */
  public string $nomUsage = '';
  /**
   * Nom de naissance.
   *
   * @var string
   * @drupalField field_identite_nom_naissance
   */
  public string $nomNaissance = '';
  /**
   * Prénom.
   *
   * @var string
   * @drupalField field_identite_prenom
   */
  public string $prenom = '';
  /**
   * Date de naissance.
   *
   * @var string
   * @presave presave_process_plugin dateEn
   * @drupalField field_identite_date_naissance
   */
  public string $dateNaissance = '';
  /**
   * Lieu de naissance.
   *
   * @var string
   * @drupalField field_identite_lieu_naissance
   */
  public string $lieuNaissance = '';
  /**
   * N° d'Identification National.
   *
   * @var string
   * @drupalField field_identite_nin
   */
  public string $nin = '';
  /**
   * N°d'Identification Etudiant.
   *
   * @var string
   * @drupalField field_identite_nie
   */
  public string $nie = '';
}
