<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class TaxonomyModel.
 */
class TaxonomyModel {
  /**
   * Taxonomy ID
   *
   * @var int
   * @drupalField tid
   */
  public int $tid = 0;
  /**
   * Nom de la taxonomy.
   *
   * @var string
   *
   * @drupalField name
   */
  public string $name = '';
}
