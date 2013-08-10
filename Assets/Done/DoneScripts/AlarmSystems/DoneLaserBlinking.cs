using UnityEngine;
using System.Collections;

public class DoneLaserBlinking : MonoBehaviour
{
	public float onTime;			// Amount of time in seconds the laser is on for.
	public float offTime;			// Amount of time in seconds the laser is off for.
	
	
	private float timer;			// Timer to time the laser blinking.
	
	
	void Update ()
	{
		// Increment the timer by the amount of time since the last frame.
        timer += Time.deltaTime;
		
		// If the beam is on and the onTime has been reached...
        if(renderer.enabled && timer >= onTime)
			// Switch the beam.
            SwitchBeam();
		
		// If the beam is off and the offTime has been reached...
        if(!renderer.enabled && timer >= offTime)
			// Switch the beam.
            SwitchBeam();
	}
	
	
	void SwitchBeam ()
	{
		// Reset the timer.
		timer = 0f;
		
		// Switch whether the beam and light are on or off.
	    renderer.enabled = !renderer.enabled;
		light.enabled = !light.enabled;
	}
}
