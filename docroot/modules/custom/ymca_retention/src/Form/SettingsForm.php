<?php

namespace Drupal\ymca_retention\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides form for managing module settings.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ymca_retention_general_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['ymca_retention.general_settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('ymca_retention.general_settings');

    $form['date_registration_open'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Registration open date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_registration_open'),
      '#description' => $this->t('Date and time when registration will be open.'),
    ];
    $form['date_registration_close'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Registration close date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_registration_close'),
      '#description' => $this->t('Date and time when registration will be closed.'),
    ];
    $form['date_reporting_open'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Reporting open date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_reporting_open'),
      '#description' => $this->t('Date and time when reporting will be open.'),
    ];
    $form['date_reporting_close'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Reporting close date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_reporting_close'),
      '#description' => $this->t('Date and time when reporting will be closed.'),
    ];

    $form['date_campaign_close'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Campaign close date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_reporting_close'),
      '#description' => $this->t('Date and time when campaign will be closed.'),
    ];

    $form['default_goal_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Default Goal'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('default_goal_number'),
      '#description' => $this->t('Default goal of visits for new members'),
    ];
    $form['goal_percentage'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Goal Percentage'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('goal_percentage'),
      '#description' => $this->t('Goal for each user in percentage. By default 30%.'),
    ];
    $form['date_checkins_start'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Check-ins start date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_checkins_start'),
      '#description' => $this->t('Date and time from which to take data about check-ins'),
    ];
    $form['date_checkins_end'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Check-ins end date and time'),
      '#size' => 50,
      '#maxlength' => 500,
      '#default_value' => $config->get('date_checkins_end'),
      '#description' => $this->t('End date and time for getting data about check-ins.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('dmaps.admin_settings')
      ->set('date_registration_open', $form_state->getValue('date_registration_open'))
      ->set('date_registration_close', $form_state->getValue('date_registration_close'))
      ->set('date_reporting_open', $form_state->getValue('date_reporting_open'))
      ->set('date_reporting_close', $form_state->getValue('date_reporting_close'))
      ->set('date_campaign_close', $form_state->getValue('date_campaign_close'))
      ->set('default_goal_number', $form_state->getValue('default_goal_number'))
      ->set('goal_percentage', $form_state->getValue('goal_percentage'))
      ->set('date_checkins_start', $form_state->getValue('date_checkins_start'))
      ->set('date_checkins_end', $form_state->getValue('date_checkins_end'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
