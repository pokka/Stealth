#pragma strict

public var timeToDoorsClose : float = 2f;           // Time since the player entered the lift before the doors close.
public var timeToLiftStart : float = 3f;            // Time since the player entered the lift before it starts to move.
public var timeToEndLevel : float = 6f;             // Time since the player entered the lift before the level ends.
public var liftSpeed : float = 3f;                  // The speed at which the lift moves.


private var player : GameObject;                    // Reference to the player.
private var playerAnim : Animator;                  // Reference to the players animator component.
private var hash : HashIDs;                         // Reference to the HashIDs script.
private var camMovement : CameraMovement;           // Reference to the camera movement script.
private var sceneFadeInOut : SceneFadeInOut;        // Reference to the SceneFadeInOut script.
private var liftDoorsTracking : LiftDoorsTracking;  // Reference to LiftDoorsTracking script.
private var playerInLift : boolean;                 // Whether the player is in the lift or not.
private var timer : float;                          // Timer to determine when the lift moves and when the level ends.


function Awake ()
{
    // Setting up references.
    player = GameObject.FindGameObjectWithTag(Tags.player);
    playerAnim = player.GetComponent(Animator);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    camMovement = Camera.main.gameObject.GetComponent(CameraMovement);
    sceneFadeInOut = GameObject.FindGameObjectWithTag(Tags.fader).GetComponent(SceneFadeInOut);
    liftDoorsTracking = GetComponent(LiftDoorsTracking);
}


function OnTriggerEnter (other : Collider)
{
    // If the colliding gameobject is the player...
    if(other.gameObject == player)
        // ... the player is in the lift.
        playerInLift = true;
}


function OnTriggerExit (other : Collider)
{
    // If the player leaves the trigger area...
    if(other.gameObject == player)
    {
        // ... reset the timer, the player is no longer in the lift and unparent the player from the lift.
        playerInLift = false;
        timer = 0;
    }
}


function Update ()
{
    // If the player is in the lift...
    if(playerInLift)
        // ... activate the lift.
        LiftActivation();

    // If the timer is less than the time before the doors close...
    if(timer < timeToDoorsClose)
        // ... the inner doors should follow the outer doors.
        liftDoorsTracking.DoorFollowing();
    else
        // Otherwise the doors should close.
        liftDoorsTracking.CloseDoors();
}


function LiftActivation ()
{
    // Increment the timer by the amount of time since the last frame.
    timer += Time.deltaTime;

    // If the timer is greater than the amount of time before the lift should start...
    if(timer >= timeToLiftStart)
    {
        // ... stop the player and the camera moving and parent the player to the lift.
        playerAnim.SetFloat(hash.speedFloat,0f);
        camMovement.enabled = false;
        player.transform.parent = transform;

        // Move the lift upwards.
        transform.Translate(Vector3.up * liftSpeed * Time.deltaTime);

        // If the audio clip isn't playing...
        if(!audio.isPlaying)
            // ... play the clip.
            audio.Play();

        // If the timer is greater than the amount of time before the level should end...
        if(timer >= timeToEndLevel)
            // ... call the EndScene function.
            sceneFadeInOut.EndScene();
    }
}