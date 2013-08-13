#pragma strict

public var fieldOfViewAngle : float = 110f;             // Number of degrees, centred on forward, for the enemy see.
public var playerInSight : boolean;                     // Whether or not the player is currently sighted.
public var personalLastSighting : Vector3;              // Last place this enemy spotted the player.


private var nav : NavMeshAgent;                         // Reference to the NavMeshAgent component.
private var col : SphereCollider;                       // Reference to the sphere collider trigger component.
private var anim : Animator;                            // Reference to the Animator.
private var lastPlayerSighting : LastPlayerSighting;    // Reference to last global sighting of the player.
private var player : GameObject;                        // Reference to the player.
private var playerAnim : Animator;                      // Reference to the player's animator component.
private var playerHealth : PlayerHealth;                // Reference to the player's health script.
private var hash : HashIDs;                             // Reference to the HashIDs.
private var previousSighting : Vector3;                 // Where the player was sighted last frame.


function Awake ()
{
    // Setting up the references.
    nav = GetComponent(NavMeshAgent);
    col = GetComponent(SphereCollider);
    anim = GetComponent(Animator);
    lastPlayerSighting = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(LastPlayerSighting);
    player = GameObject.FindGameObjectWithTag(Tags.player);
    playerAnim = player.GetComponent(Animator);
    playerHealth = player.GetComponent(PlayerHealth);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);

    // Set the personal sighting and the previous sighting to the reset position.
    personalLastSighting = lastPlayerSighting.resetPosition;
    previousSighting = lastPlayerSighting.resetPosition;
}


function Update ()
{
    // If the last global sighting of the player has changed...
    if(lastPlayerSighting.position != previousSighting)
        // ... then update the personal sighting to be the same as the global sighting.
        personalLastSighting = lastPlayerSighting.position;

    // Set the previous sighting to the be the sighting from this frame.
    previousSighting = lastPlayerSighting.position;

    // If the player is alive...
    if(playerHealth.health > 0f)
        // ... set the animator parameter to whether the player is in sight or not.
        anim.SetBool(hash.playerInSightBool, playerInSight);
    else
        // ... set the animator parameter to false.
        anim.SetBool(hash.playerInSightBool, false);
}


function OnTriggerStay (other : Collider)
{
    // If the player has entered the trigger sphere...
    if(other.gameObject == player)
    {
        // By default the player is not in sight.
        playerInSight = false;

        // Create a vector from the enemy to the player and store the angle between it and forward.
        var direction : Vector3 = other.transform.position - transform.position;
        var angle : float = Vector3.Angle(direction, transform.forward);

        // If the angle between forward and where the player is, is less than half the angle of view...
        if(angle < fieldOfViewAngle * 0.5f)
        {
            var hit : RaycastHit;

            // ... and if a raycast towards the player hits something...
            if(Physics.Raycast(transform.position + transform.up, direction.normalized, hit, col.radius))
            {
                // ... and if the raycast hits the player...
                if(hit.collider.gameObject == player)
                {
                    // ... the player is in sight.
                    playerInSight = true;

                    // Set the last global sighting is the players current position.
                    lastPlayerSighting.position = player.transform.position;
                }
            }
        }

        // Store the name hashes of the current states.
        var playerLayerZeroStateHash : int = playerAnim.GetCurrentAnimatorStateInfo(0).nameHash;
        var playerLayerOneStateHash : int = playerAnim.GetCurrentAnimatorStateInfo(1).nameHash;

        // If the player is running or is attracting attention...
        if(playerLayerZeroStateHash == hash.locomotionState || playerLayerOneStateHash == hash.shoutState)
        {
            // ... and if the player is within hearing range...
            if(CalculatePathLength(player.transform.position) <= col.radius)
                // ... set the last personal sighting of the player to the player's current position.
                personalLastSighting = player.transform.position;
        }
    }
}


function OnTriggerExit (other : Collider)
{
    // If the player leaves the trigger zone...
    if(other.gameObject == player)
        // ... the player is not in sight.
        playerInSight = false;
}


function CalculatePathLength (targetPosition : Vector3)
{
    // Create a path and set it based on a target position.
    var path : NavMeshPath = new NavMeshPath();
    if(nav.enabled)
        nav.CalculatePath(targetPosition, path);

    // Create an array of points which is the length of the number of corners in the path + 2.
    var allWayPoints : Vector3[] = new Vector3[path.corners.Length + 2];

    // The first point is the enemy's position.
    allWayPoints[0] = transform.position;

    // The last point is the target position.
    allWayPoints[allWayPoints.Length - 1] = targetPosition;

    // The points inbetween are the corners of the path.
    for(var i = 0; i < path.corners.Length; i++)
    {
        allWayPoints[i + 1] = path.corners[i];
    }

    // Create a float to store the path length that is by default 0.
    var pathLength : float = 0;

    // Increment the path length by an amount equal to the distance between each waypoint and the next.
    for(var j = 0; j < allWayPoints.Length - 1; j++)
    {
        pathLength += Vector3.Distance(allWayPoints[j], allWayPoints[j + 1]);
    }

    return pathLength;
}