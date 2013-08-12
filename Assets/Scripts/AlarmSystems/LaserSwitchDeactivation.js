#pragma strict

public var laser : GameObject;              // Reference to the laser that can we turned off at this switch.
public var unlockedMat : Material;          // The screen's material to show the laser has been unloacked.

private var player : GameObject;            // Reference to the player.
private var lasers : GameObject[];

function Awake ()
{
    // Setting up the reference.
    player = GameObject.FindGameObjectWithTag(Tags.player);
    // lasers = GameObject.FindGameObjectsWithTag(Tags.laser);
}


function OnTriggerStay (other : Collider)
{
    // If the colliding gameobject is the player...
    if(other.gameObject == player)
        // ... and the switch button is pressed...
        if(Input.GetButton("Switch"))
            // ... deactivate the laser.
            LaserDeactivation();
}


function LaserDeactivation ()
{
    // Deactivate the laser GameObject.
    // for (var i = 0; i < lasers.length; i++) {
    //   lasers[i].SetActive(!laserOn);
    // };
    laser.SetActive(false);
    // Store the renderer component of the screen.
    var screen : Renderer = transform.Find("prop_switchUnit_screen").renderer;

    // Change the material of the screen to the unlocked material.
    screen.material = unlockedMat;

    // Play switch deactivation audio clip.
    audio.Play();
}