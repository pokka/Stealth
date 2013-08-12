#pragma strict

public var requireKey : boolean;                    // Whether or not a key is required.
public var doorSwishClip : AudioClip;               // Clip to play when the doors open or close.
public var accessDeniedClip : AudioClip;            // Clip to play when the player doesn't have the key for the door.


private var anim : Animator;                        // Reference to the animator component.
private var hash : HashIDs;                     // Reference to the HashIDs script.
private var player : GameObject;                    // Reference to the player GameObject.
private var playerInventory : PlayerInventory;  // Reference to the PlayerInventory script.
private var count : int;                            // The number of colliders present that should open the doors.


function Awake ()
{
    // Setting up the references.
    anim = GetComponent(Animator);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
    player = GameObject.FindGameObjectWithTag(Tags.player);
    playerInventory = player.GetComponent(PlayerInventory);
}


function OnTriggerEnter (other : Collider)
{
    // If the triggering gameobject is the player...
    if(other.gameObject == player)
    {
        // ... if this door requires a key...
        if(requireKey)
        {
            // ... if the player has the key...
            if(playerInventory.hasKey)
                // ... increase the count of triggering objects.
                count++;
            else
            {
                // If the player doesn't have the key play the access denied audio clip.
                audio.clip = accessDeniedClip;
                audio.Play();
            }
        }
        else
            // If the door doesn't require a key, increase the count of triggering objects.
            count++;
    }
    // If the triggering gameobject is an enemy...
    else if(other.gameObject.tag == Tags.enemy)
    {
        // ... if the triggering collider is a capsule collider...
        if(typeof(other) == CapsuleCollider)
            // ... increase the count of triggering objects.
            count++;
    }
}


function OnTriggerExit (other : Collider)
{
    // If the leaving gameobject is the player or an enemy and the collider is a capsule collider...
    if(other.gameObject == player || (other.gameObject.tag == Tags.enemy && typeof(other) == CapsuleCollider))
        // decrease the count of triggering objects.
        count = Mathf.Max(0, count-1);
}


function Update ()
{
    // Set the open parameter.
    anim.SetBool(hash.openBool,count > 0);

    // If the door is opening or closing...
    if(anim.IsInTransition(0) && !audio.isPlaying)
    {
        // ... play the door swish audio clip.
        audio.clip = doorSwishClip;
        audio.Play();
    }
}