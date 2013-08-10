#pragma strict

public var position : Vector3 = new Vector3(1000f, 1000f, 1000f);       // The last global sighting of the player.
public var resetPosition : Vector3 = new Vector3(1000f, 1000f, 1000f);  // The default position if the player is not in sight.
public var lightHighIntensity : float = 0.25f;                          // The directional light's intensity when the alarms are off.
public var lightLowIntensity : float = 0f;                              // The directional light's intensity when the alarms are on.
public var fadeSpeed : float = 7f;                                      // How fast the light fades between low and high intensity.
public var musicFadeSpeed : float = 1f;                                 // The speed at which the


private var alarm : AlarmLight;                                     // Reference to the AlarmLight script.
private var mainLight : Light;                                          // Reference to the main light.
private var panicAudio : AudioSource;                                       // Reference to the AudioSource of the panic msuic.
private var sirens : AudioSource[];                                     // Reference to the AudioSources of the megaphones.


function Awake ()
{
    // Setup the reference to the alarm light.
    alarm = GameObject.FindGameObjectWithTag(Tags.alarm).GetComponent(AlarmLight);

    // Setup the reference to the main directional light in the scene.
    mainLight = GameObject.FindGameObjectWithTag(Tags.mainLight).light;

    // Setup the reference to the additonal audio source.
    panicAudio = transform.Find("secondaryMusic").audio;

    // Find an array of the siren gameobjects.
    var sirenGameObjects : GameObject[] = GameObject.FindGameObjectsWithTag(Tags.siren);

    // Set the sirens array to have the same number of elements as there are gameobjects.
    sirens = new AudioSource[sirenGameObjects.Length];

    // For all the sirens allocate the audio source of the gameobjects.
    for(var i = 0; i < sirens.Length; i++)
    {
        sirens[i] = sirenGameObjects[i].audio;
    }
}


function Update ()
{
    // Switch the alarms and fade the music.
    SwitchAlarms();
    MusicFading();
}


function SwitchAlarms ()
{
    // Set the alarm light to be on or off.
    alarm.alarmOn = position != resetPosition;

    // Create a new intensity.
    var newIntensity : float;

    // If the position is not the reset position...
    if(position != resetPosition)
        // ... then set the new intensity to low.
        newIntensity = lightLowIntensity;
    else
        // Otherwise set the new intensity to high.
        newIntensity = lightHighIntensity;

    // Fade the directional light's intensity in or out.
    mainLight.intensity = Mathf.Lerp(mainLight.intensity, newIntensity, fadeSpeed * Time.deltaTime);

    // For all of the sirens...
    for(var i = 0; i < sirens.Length; i++)
    {
        // ... if alarm is triggered and the audio isn't playing, then play the audio.
        if(position != resetPosition && !sirens[i].isPlaying)
            sirens[i].Play();
        // Otherwise if the alarm isn't triggered, stop the audio.
        else if(position == resetPosition)
            sirens[i].Stop();
    }
}


function MusicFading ()
{
    // If the alarm is not being triggered...
    if(position != resetPosition)
    {
        // ... fade out the normal music...
        audio.volume = Mathf.Lerp(audio.volume, 0f, musicFadeSpeed * Time.deltaTime);

        // ... and fade in the panic music.
        panicAudio.volume = Mathf.Lerp(panicAudio.volume, 0.8f, musicFadeSpeed * Time.deltaTime);
    }
    else
    {
        // Otherwise fade in the normal music and fade out the panic music.
        audio.volume = Mathf.Lerp(audio.volume, 0.8f, musicFadeSpeed * Time.deltaTime);
        panicAudio.volume = Mathf.Lerp(panicAudio.volume, 0f, musicFadeSpeed * Time.deltaTime);
    }
}