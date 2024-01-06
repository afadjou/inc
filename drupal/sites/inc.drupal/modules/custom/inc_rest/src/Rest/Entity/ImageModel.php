<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class ImageModel.
 */
class ImageModel {

  /**
   * File ID.
   *
   * @var int
   *
   * @drupalField fid
   */
  public int $fid = 0;

  /**
   * File name.
   *
   * @var string
   *
   * @drupalField filename
   */
  public string $filename = '';
  /**
   * File URI.
   *
   * @var string
   * @plugin validation_data_format url
   * @drupalField uri
   */
  public string $url = '';
}
