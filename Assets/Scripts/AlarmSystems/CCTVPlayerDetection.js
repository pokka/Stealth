#pragma strict

private var player : GameObject;                                // Reference to the player.
private var lastPlayerSighting : LastPlayerSighting;        // Reference to the global last sighting of the player.


function Awake ()
{
    // Setting up the references.
    player = GameObject.FindGameObjectWithTag(Tags.player);
    lastPlayerSighting = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(LastPlayerSighting);
}


function OnTriggerStay (other : Collider)
{
    // If the colliding gameobject is the player...
    if(other.gameObject == player)
    {
        // ... raycast from the camera towards the player.
        var relPlayerPos : Vector3 = player.transform.position - transform.position;
        var hit : RaycastHit;

        if(Physics.Raycast(transform.position, relPlayerPos, hit))
            // If the raycast hits the player...
            if(hit.collider.gameObject == player)
                // ... set the last global sighting of the player to the player's position.
                lastPlayerSighting.position = player.transform.position;
    }
}