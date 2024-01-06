<?php

namespace Drupal\inc_rest\Rest\Entity;

/**
 * Class UriModel.
 */
class UriModel {

  /**
   * Drupal url value.
   *
   * @var string
   *
   * @drupalField fid
   */
  public string $value = '';

  /**
   * File url.
   *
   * @var string
   *
   * @drupalField url
   */
  public string $url = '';
}
