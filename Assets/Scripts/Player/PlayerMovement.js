#pragma strict

public var shoutingClip : AudioClip;        // Audio clip of the player shouting.
public var turnSmoothing : float = 15f;     // A smoothing value for turning the player.
public var speedDampTime : float = 0.1f;    // The damping for the speed parameter


private var anim : Animator;                // Reference to the animator component.
private var hash : HashIDs;             // Reference to the HashIDs.


function Awake ()
{
    // Setting up the references.
    anim = GetComponent(Animator);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);

    // Set the weight of the shouting layer to 1.
    anim.SetLayerWeight(1, 1f);
}


function FixedUpdate ()
{
    // Cache the inputs.
    var h : float = Input.GetAxis("Horizontal");
    var v : float = Input.GetAxis("Vertical");
    var sneak : boolean = Input.GetButton("Sneak");

    MovementManagement(h, v, sneak);
}


function Update ()
{
    // Cache the attention attracting input.
    var shout : boolean = Input.GetButtonDown("Attract");

    // Set the animator shouting parameter.
    anim.SetBool(hash.shoutingBool, shout);

    AudioManagement(shout);
}


function MovementManagement (horizontal : float, vertical : float, sneaking : boolean)
{
    // Set the sneaking parameter to the sneak input.
    anim.SetBool(hash.sneakingBool, sneaking);

    // If there is some axis input...
    if(horizontal != 0f || vertical != 0f)
    {
        // ... set the players rotation and set the speed parameter to 5.5f.
        Rotating(horizontal, vertical);
        anim.SetFloat(hash.speedFloat, 5.5f, speedDampTime, Time.deltaTime);
    }
    else
        // Otherwise set the speed parameter to 0.
        anim.SetFloat(hash.speedFloat, 0);
}


function Rotating (horizontal : float, vertical : float)
{
    // Create a new vector of the horizontal and vertical inputs.
    var targetDirection : Vector3 = new Vector3(horizontal, 0f, vertical);

    // Create a rotation based on this new vector assuming that up is the global y axis.
    var targetRotation : Quaternion = Quaternion.LookRotation(targetDirection, Vector3.up);

    // Create a rotation that is an increment closer to the target rotation from the player's rotation.
    var newRotation : Quaternion = Quaternion.Lerp(rigidbody.rotation, targetRotation, turnSmoothing * Time.deltaTime);

    // Change the players rotation to this new rotation.
    rigidbody.MoveRotation(newRotation);
}


function AudioManagement (shout : boolean)
{
    // If the player is currently in the run state...
    if(anim.GetCurrentAnimatorStateInfo(0).nameHash == hash.locomotionState)
    {
        // ... and if the footsteps are not playing...
        if(!audio.isPlaying)
            // ... play them.
            audio.Play();
    }
    else
        // Otherwise stop the footsteps.
        audio.Stop();

    // If the shout input has been pressed...
    if(shout)
        // ... play the shouting clip where we are.
        AudioSource.PlayClipAtPoint(shoutingClip, transform.position);
}