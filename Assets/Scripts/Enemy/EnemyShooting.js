#pragma strict

public var maximumDamage : float = 120f;                    // The maximum potential damage per shot.
public var minimumDamage : float = 45f;                 // The minimum potential damage per shot.
public var shotClip : AudioClip;                            // An audio clip to play when a shot happens.
public var flashIntensity : float = 3f;                 // The intensity of the light when the shot happens.
public var fadeSpeed : float = 10f;                     // How fast the light will fade after the shot.


private var anim : Animator;                                // Reference to the animator.
private var hash : HashIDs;                             // Reference to the HashIDs script.
private var laserShotLine : LineRenderer;                   // Reference to the laser shot line renderer.
private var laserShotLight : Light;                     // Reference to the laser shot light.
private var col : SphereCollider;                           // Reference to the sphere collider.
private var player : Transform;                         // Reference to the player's transform.
private var playerHealth : PlayerHealth;                    // Reference to the player's health.
private var shooting : boolean;                             // A bool to say whether or not the enemy is currently shooting.
private var scaledDamage : float;                           // Amount of damage that is scaled by the distance from the player.


function Awake ()
{
    // Setting up the references.
    anim = GetComponent(Animator);
    laserShotLine = GetComponentInChildren(LineRenderer);
    laserShotLight = laserShotLine.gameObject.light;
    col = GetComponent(SphereCollider);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.gameObject.GetComponent(PlayerHealth);
    hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);

    // The line renderer and light are off to start.
    laserShotLine.enabled = false;
    laserShotLight.intensity = 0f;

    // The scaledDamage is the difference between the maximum and the minimum damage.
    scaledDamage = maximumDamage - minimumDamage;
}


function Update ()
{
    // Cache the current value of the shot curve.
    var shot : float = anim.GetFloat(hash.shotFloat);

    // If the shot curve is peaking and the enemy is not currently shooting...
    if(shot > 0.5f && !shooting)
        // ... shoot
        Shoot();

    // If the shot curve is no longer peaking...
    if(shot < 0.5f)
    {
        // ... the enemy is no longer shooting and disable the line renderer.
        shooting = false;
        laserShotLine.enabled = false;
    }

    // Fade the light out.
    laserShotLight.intensity = Mathf.Lerp(laserShotLight.intensity, 0f, fadeSpeed * Time.deltaTime);
}


function OnAnimatorIK (layerIndex : int)
{
    // Cache the current value of the AimWeight curve.
    var aimWeight : float = anim.GetFloat(hash.aimWeightFloat);

    // Set the IK position of the right hand to the player's centre.
    anim.SetIKPosition(AvatarIKGoal.RightHand, player.position + Vector3.up);

    // Set the weight of the IK compared to animation to that of the curve.
    anim.SetIKPositionWeight(AvatarIKGoal.RightHand, aimWeight);
}


function Shoot ()
{
    // The enemy is shooting.
    shooting = true;

    // The fractional distance from the player, 1 is next to the player, 0 is the player is at the extent of the sphere collider.
    var fractionalDistance : float = (col.radius - Vector3.Distance(transform.position, player.position)) / col.radius;

    // The damage is the scaled damage, scaled by the fractional distance, plus the minimum damage.
    var damage : float = scaledDamage * fractionalDistance + minimumDamage;

    // The player takes damage.
    playerHealth.TakeDamage(damage);

    // Display the shot effects.
    ShotEffects();
}


function ShotEffects ()
{
    // Set the initial position of the line renderer to the position of the muzzle.
    laserShotLine.SetPosition(0, laserShotLine.transform.position);

    // Set the end position of the player's centre of mass.
    laserShotLine.SetPosition(1, player.position + Vector3.up * 1.5f);

    // Turn on the line renderer.
    laserShotLine.enabled = true;

    // Make the light flash.
    laserShotLight.intensity = flashIntensity;

    // Play the gun shot clip at the position of the muzzle flare.
    AudioSource.PlayClipAtPoint(shotClip, laserShotLight.transform.position);
}