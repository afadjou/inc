<?php

namespace Drupal\inc_rest\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Class Elements
 *
 * @Annotation
 *
 * @package Drupal\inc_rest\Annotation
 */
class Action extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public string $id;

  /**
   * The label of the plugin.
   *
   * @var string
   *
   * @ingroup plugin_translatable
   */
  public string $label;

}
