<?php

namespace Drupal\ymca_retention\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\ymca_retention\AnonymousCookieStorage;
use Drupal\ymca_retention\Entity\Member;

/**
 * Provides a block with registration form.
 *
 * @Block(
 *   id = "retention_member_info_block",
 *   admin_label = @Translation("YMCA retention member info block"),
 *   category = @Translation("YMCA Blocks")
 * )
 */
class MemberInfo extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $member_id = AnonymousCookieStorage::get('ymca_retention_member');
    $member = Member::load($member_id);

    return [
      '#theme' => 'ymca_retention_member_info',
      '#member' => [
        'name' => $member->getFullName(),
        'goal' => $member->getVisitGoal(),
        'visits' => $member->getVisits(),
        'percentage' => min(round((5 / 15) * 100), 100),
        'activities' => 12,
        'rank' => 123,
      ],
    ];
  }

}
