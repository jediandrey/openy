<?php

namespace Drupal\openy_myy\Plugin\rest\resource;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\openy_myy\PluginManager\MyYDataProfile;

/**
 * Provides a Demo Resource
 *
 * @RestResource(
 *   id = "myy_profile_family_list",
 *   label = @Translation("List of Family members"),
 *   uri_paths = {
 *     "canonical" = "/myy/data/profile/family-list"
 *   }
 * )
 */
class MyYProfileFamilyList extends ResourceBase {


  /**
   * @var \Drupal\openy_myy\PluginManager\MyYDataProfile
   */
  protected $myYDataProfile;

  /**
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $config;

  /**
   * MyYProfileFamilyList constructor.
   *
   * @param array $configuration
   * @param $plugin_id
   * @param $plugin_definition
   * @param array $serializer_formats
   * @param \Psr\Log\LoggerInterface $logger
   * @param \Drupal\openy_myy\PluginManager\MyYDataProfile $myYDataProfile
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    MyYDataProfile $myYDataProfile,
    ConfigFactoryInterface $configFactory
   ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->config = $configFactory->get('openy_myy.settings');
    $this->myYDataProfile = $myYDataProfile;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('openy_node_alert'),
      $container->get('plugin.manager.myy_data_profile'),
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function get() {

    $myy_config = $this->config->getRawData();
    $myy_authenticator_instances = $this->myYDataProfile->getDefinitions();
    if (array_key_exists($myy_config['myy_data_profile'], $myy_authenticator_instances)) {
      $response = $this
        ->myYDataProfile
        ->createInstance($myy_config['myy_data_profile'])
        ->getFamilyInfo();
    } else {
      return new NotFoundHttpException();
    }

    return new ResourceResponse($response);

  }

}
