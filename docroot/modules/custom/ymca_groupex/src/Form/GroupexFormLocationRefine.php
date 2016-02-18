<?php

namespace Drupal\ymca_groupex\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

/**
 * Implements Groupex Location Refine Form.
 */
class GroupexFormLocationRefine extends GroupexFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'groupex_form_location_refine';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // Check if we have additional argument to prepopulate the form.
    $refine = FALSE;
    $params = [];
    $args = func_get_args();
    if (isset($args[2])) {
      $refine = TRUE;
      $params = $args[2];
    }

    $form = parent::buildForm($form, $form_state, $params);

    $form['location'] = [
      '#type' => 'checkboxes',
      '#options' => $this->getOptions($this->request(['query' => ['locations' => TRUE]]), 'id', 'name'),
      '#title' => $this->t('Location'),
      '#title_extra' => $this->t('(optional—select up to 4)'),
      '#weight' => -100,
      '#default_value' => $refine ? $params['location'] : [],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Get current node.
    /** @var Node $node */
    $node = \Drupal::routeMatch()->getParameter('node');

    $form_state->setRedirect(
      'ymca_groupex.schedules_search_results',
      ['node' => $node->id()],
      ['query' => $this->getRedirectParams($form, $form_state)]
    );
  }

}
