#pragma strict

private var player : GameObject;                                // Reference to the player.
private var lastPlayerSighting : LastPlayerSighting;        // Reference to the global last sighting of the player.


function Awake ()
{
    // Setting up references.
    player = GameObject.FindGameObjectWithTag(Tags.player);
    lastPlayerSighting = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(LastPlayerSighting);
}


function OnTriggerStay(other : Collider)
{
    // If the beam is on...
    if(renderer.enabled)
        // ... and if the colliding gameobject is the player...
        if(other.gameObject == player)
            // ... set the last global sighting of the player to the colliding object's position.
            lastPlayerSighting.position = other.transform.position;
}