using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviourSingleton<GameManager>
{
    public string AccessToken { get; private set; }
    public Module Module { get; private set; }

    protected override void Awake()
    {
        base.Awake();
        Module = new Module();
        //StartGame("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2FybWVsYSBDYWxsaWNvYXQiLCJlbWFpbCI6ImNhcm1lbGFjYWxsaWNvYXRAc2l0LnNpbmdhcG9yZXRlY2guZWR1LnNnIiwidXNlcklkIjoiNWY4ZDM0MmQ5YzAwNDk0OTljYmM4NmM3Iiwicm9sZSI6MiwiaWF0IjoxNjAzMTAyNzM4fQ.-wOGyA7rWhQMXy7WMZkl78ITeOvSjkuge0ytgOOl310");
    }

    public void OnUnityLoad()
    {
        //Send message to javascript
    }

    public void StartGame(string accessToken)
    {
        AccessToken = accessToken;
        SceneManager.LoadScene("SceneModule");
    }
}
