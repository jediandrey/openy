<?php

namespace Drupal\openy_campaign\Form;

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
    return 'openy_campaign_general_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['openy_campaign.general_settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('openy_campaign.general_settings');

    $form['error_msg_membership_id'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Error Message: Incorrect Membership ID'),
      '#default_value' => $config->get('error_msg_membership_id')['value'],
      '#format' => $config->get('error_msg_membership_id')['format'],
      '#description' => $this->t('Message to display if user is trying to register/login with an incorrect membership ID. Example:
        Please check your member ID to ensure it has been entered correctly. If you have entered your number correctly 
        and it still is not working, please contact our customer service center at 612-230-9622.
      '),
    ];

    $form['error_msg_checkins_not_started'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Error Message: Registered previously member, but the campaign challenges have not yet started'),
      '#default_value' => $config->get('error_msg_checkins_not_started')['value'],
      '#format' => $config->get('error_msg_checkins_not_started')['format'],
      '#description' => $this->t('Message to display when member is already registered previously, 
        but the campaign challenges have not yet started. Example:
        Good news! Our records show you have already registered.
        If you think this is a mistake, please contact our customer service center at 612-230-9622.
      '),
    ];

    $form['error_msg_not_registered'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Login Error Message: Member is not registered'),
      '#default_value' => $config->get('error_msg_not_registered')['value'],
      '#format' => $config->get('error_msg_not_registered')['format'],
      '#description' => $this->t('Message to display during login if the member is not registered previously. Example:
        Member with this member ID is not registered. Please register.
      '),
    ];

    $form['error_msg_already_registered'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Registration Error Message: Member is already registered'),
      '#default_value' => $config->get('error_msg_already_registered')['value'],
      '#format' => $config->get('error_msg_already_registered')['format'],
      '#description' => $this->t('Message to display during registration if the member is already registered previously. Example:
        You\'re already signed up! You can check your progress or report activities by signing in here.
      '),
    ];

    $form['error_msg_member_is_inactive'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Error Message: Member is inactive'),
      '#default_value' => $config->get('error_msg_member_is_inactive')['value'],
      '#format' => $config->get('error_msg_member_is_inactive')['format'],
      '#description' => $this->t('Message to display if the member ID entered is inactive. Example:
        Our records indicate the member ID entered is inactive. Please check your member ID and
        re-enter it, or contact the customer service center at 612-230-9622.
      '),
    ];

    $form['error_msg_target_audience_settings'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Error Message: Member is ineligible due to the Target Audience Setting'),
      '#default_value' => $config->get('error_msg_target_audience_settings')['value'],
      '#format' => $config->get('error_msg_target_audience_settings')['format'],
      '#description' => $this->t('Message to display if member is ineligible due to the Target Audience Setting. Example:
        We\'re sorry, but you are not eligible to participate in this promotion. Please check the rules page for details.
        If you have any questions, please contact our customer service center at 612-230-9622.
      '),
    ];

    $form['error_msg_default'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Error Message: Default message'),
      '#default_value' => $config->get('error_msg_default')['value'],
      '#format' => $config->get('error_msg_default')['format'],
      '#description' => $this->t('Message to display in all other cases. Example: 
        Something went wrong. Please contact our customer service center at 612-230-9622.
      '),
    ];

    $form['register_form_text'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Register form: Member ID text'),
      '#default_value' => $config->get('register_form_text')['value'],
      '#format' => $config->get('register_form_text')['format'],
      '#description' => $this->t('"Where can I find my Member ID?" link text.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('openy_campaign.general_settings');
    $config->set('error_msg_membership_id', $form_state->getValue('error_msg_membership_id'));
    $config->set('error_msg_checkins_not_started', $form_state->getValue('error_msg_checkins_not_started'));
    $config->set('error_msg_not_registered', $form_state->getValue('error_msg_not_registered'));
    $config->set('error_msg_already_registered', $form_state->getValue('error_msg_already_registered'));
    $config->set('error_msg_member_is_inactive', $form_state->getValue('error_msg_member_is_inactive'));
    $config->set('error_msg_target_audience_settings', $form_state->getValue('error_msg_target_audience_settings'));
    $config->set('error_msg_default', $form_state->getValue('error_msg_default'));
    $config->set('register_form_text', $form_state->getValue('register_form_text'));
    $config->save();

    parent::submitForm($form, $form_state);
  }

}
