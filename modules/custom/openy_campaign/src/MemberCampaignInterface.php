<?php

namespace Drupal\openy_campaign;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\node\NodeInterface;
use Drupal\openy_campaign\Entity\Member;

/**
 * Provides an interface defining a MemberCampaign entity.
 *
 * @ingroup openy_campaign
 */
interface MemberCampaignInterface extends ContentEntityInterface {

  /**
   * Get MemberCampaign id.
   *
   * @return int
   *   Internal Id.
   */
  public function getId();

  /**
   * Returns the campaign id of the user.
   *
   * @return int
   *   campaign Id.
   */
  public function getCampaign();

  /**
   * Sets the campaign of the user.
   *
   * @param NodeInterface $campaign
   *   The campaign object.
   *
   * @return \Drupal\openy_campaign\MemberCampaignInterface
   *   The called member entity.
   */
  public function setCampaign(NodeInterface $campaign);

  /**
   * Returns the member object.
   *
   * @return Member
   *   The member object.
   */
  public function getMember();

  /**
   * Sets the member object.
   *
   * @param MemberInterface $member
   *   The member.
   *
   * @return \Drupal\openy_campaign\MemberInterface
   *   The called member entity.
   */
  public function setMember(MemberInterface $member);

  /**
   * Returns the visit goal.
   *
   * @return int
   *   visit goal.
   */
  public function getGoal();

  /**
   * Sets the visit goal for MemberCampaign.
   *
   * @param int $goal
   *   The campaign object.
   *
   * @return \Drupal\openy_campaign\MemberCampaignInterface
   *   The called member entity.
   */
  public function setGoal($goal);

}
