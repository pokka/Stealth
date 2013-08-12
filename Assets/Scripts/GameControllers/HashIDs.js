#pragma strict

// Here we store the hash tags for various strings used in our animators.
public var dyingState : int;
public var locomotionState : int;
public var shoutState : int;
public var deadBool : int;
public var speedFloat : int;
public var sneakingBool : int;
public var shoutingBool : int;
public var playerInSightBool : int;
public var shotFloat : int;
public var aimWeightFloat : int;
public var angularSpeedFloat : int;
public var openBool : int;


function Awake ()
{
    dyingState = Animator.StringToHash("Base Layer.Dying");
    locomotionState = Animator.StringToHash("Base Layer.Locomotion");
    shoutState = Animator.StringToHash("Shouting.Shout");
    deadBool = Animator.StringToHash("Dead");
    speedFloat = Animator.StringToHash("Speed");
    sneakingBool = Animator.StringToHash("Sneaking");
    shoutingBool = Animator.StringToHash("Shouting");
    playerInSightBool = Animator.StringToHash("PlayerInSight");
    shotFloat = Animator.StringToHash("Shot");
    aimWeightFloat = Animator.StringToHash("AimWeight");
    angularSpeedFloat = Animator.StringToHash("AngularSpeed");
    openBool = Animator.StringToHash("Open");
}