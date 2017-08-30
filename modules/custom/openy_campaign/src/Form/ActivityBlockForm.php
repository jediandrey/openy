<?php

namespace Drupal\openy_campaign\Form;

use Drupal\Component\Utility\SafeMarkup;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Url;
use Drupal\openy_campaign\Entity\MemberCampaignActivity;
use Drupal\openy_campaign\Entity\MemberCampaign;
use Drupal\openy_campaign\Entity\MemberCheckin;

/**
 * Provides a "openy_campaign_activity_block_form" form.
 */
class ActivityBlockForm extends FormBase {

  /**
   * Renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;


  /**
   * CalcBlockForm constructor.
   *
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   Renderer.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  public function __construct(RendererInterface $renderer, EntityTypeManagerInterface $entity_type_manager) {
    $this->renderer = $renderer;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('renderer'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'openy_campaign_activity_block_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $campaignId = NULL) {

    // Check if member logged in
    if (!MemberCampaign::isLoggedIn($campaignId)) {
      return [
        'message' => [
          '#markup' => $this->t('Please, sign in or register.'),
        ],
        'link' => [
          '#type' => 'link',
          '#title' => $this->t('Sign in'),
          '#url' => Url::fromRoute('openy_campaign.member-action', ['action' => 'login', 'campaign_id' => $campaignId]),
          '#attributes' => [
            'class' => [
              'use-ajax',
              'login'
            ],
          ],
        ]
      ];
    }

    $memberCampaignData = MemberCampaign::getMemberCampaignData($campaignId);
    $membershipId = $memberCampaignData['membership_id'];

    // Get MemberCampaign ID
    $memberCampaignId = MemberCampaign::findMemberCampaign($membershipId, $campaignId);
    if (!$memberCampaignId) {
      return [];
    }

    /** @var Node $campaign */
    $campaign = Node::load($campaignId);

    /** @var \Drupal\taxonomy\Entity\Vocabulary $vocabulary */
    $vocabulary = $campaign->field_campaign_fitness_category->entity;
    /** @var \Drupal\taxonomy\VocabularyStorageInterface $vocabularyStorage */
    $vocabularyStorage = $this->entityTypeManager->getStorage('taxonomy_vocabulary');
    $tids = $vocabularyStorage->getToplevelTids([$vocabulary->id()]);

    $terms = Term::loadMultiple($tids);

    /** @var \DateTime $start */
    $start = $campaign->field_campaign_start_date->date;

    // Reset time to include the current day to the list.
    $start->setTime(0, 0, 0);

    /** @var \DateTime $end */
    $end = $campaign->field_campaign_end_date->date;

    if (empty($start) || empty($end)) {
      drupal_set_message('Start or End dates are not set for campaign.', 'error');
      return [
        'message' => [
          '#markup' => '[ Placeholder for Activity Tracking block ]',
        ],
      ];
    }

    $facilityCheckInIds = MemberCheckin::getFacilityCheckIns($memberCampaignData['member_id'], $start, $end);
    $checkinRecords = [];

    foreach (MemberCheckin::loadMultiple($facilityCheckInIds) as $checkIn) {
      $checkInDate = new \DateTime('@' . $checkIn->date->value);
      $checkinRecords[$checkInDate->format('Y-m-d')] = $checkInDate->format('Y-m-d');
    }

    $stopper = 0;
    while ($end->format('U') > $start->format('U') && $stopper < 100) {
      $key = $start->format('Y-m-d');

      $disabled = FALSE;
      if (\Drupal::time()->getRequestTime() < $start->format('U')) {
        $disabled = TRUE;
      }

      if (isset($checkinRecords[$key])) {
        $form[$key]['checkin'] = [
          '#markup' => 'checked in',
        ];
      }

      /**
       * @var int $tid Term ID
       * @var Term $term
       */
      foreach ($terms as $tid => $term) {

        $childTerms = $this->entityTypeManager->getStorage("taxonomy_term")->loadTree($vocabulary->id(), $tid, 1, TRUE);
        $childTermIds = [];
        /** @var Term $childTerm */
        foreach ($childTerms as $childTerm) {
          $childTermIds[] = $childTerm->id();
        }

        $date = new \DateTime($key);
        $activityIds = MemberCampaignActivity::getExistingActivities($memberCampaignId, $date, $childTermIds);

        $name = $term->getName();
        if (!empty($activityIds)) {
          $name .= ' x ' . count($activityIds);
        }

        if ($disabled) {
          $form[$key][$tid] = [
            '#markup' => '<div class="btn btn-primary" disabled="disabled">' . SafeMarkup::checkPlain($name) . '</div>'
          ];
        }
        else {
          $form[$key][$tid] = [
            '#type' => 'link',
            '#title' => $name,
            '#url' => Url::fromRoute('openy_campaign.track-activity', [
              'visit_date' => $key,
              'member_campaign_id' => $memberCampaignId,
              'top_term_id' => $tid,
            ]),
            '#attributes' => [
              'class' => [
                'use-ajax',
                'btn',
                'btn-primary',
              ],
            ],
          ];
        }
      }

      $start->modify('+1 day');
    }

    $form['#theme'] = 'openy_campaign_activity_form';

    // Attach the library for pop-up dialogs/modals.
    $form['#attached']['library'][] = 'core/drupal.dialog.ajax';

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {

  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}
