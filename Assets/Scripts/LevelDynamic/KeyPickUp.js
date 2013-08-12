#pragma strict

public var keyGrab : AudioClip;                         // Audioclip to play when the key is picked up.


private var player : GameObject;                        // Reference to the player.
private var playerInventory : PlayerInventory;      // Reference to the player's inventory.


function Awake ()
{
    // Setting up the references.
    player = GameObject.FindGameObjectWithTag(Tags.player);
    playerInventory = player.GetComponent(PlayerInventory);
}


function OnTriggerEnter (other : Collider)
{
    // If the colliding gameobject is the player...
    if(other.gameObject == player)
    {
        // ... play the clip at the position of the key...
        AudioSource.PlayClipAtPoint(keyGrab, transform.position);

        // ... the player has a key ...
        playerInventory.hasKey = true;

        // ... and destroy this gameobject.
        Destroy(gameObject);
    }
}