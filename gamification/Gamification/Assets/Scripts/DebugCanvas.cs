using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class DebugCanvas : MonoBehaviour
{
    bool toggle = true;

    private void Awake()
    {
        SceneManager.LoadScene("SceneGamification");
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.P))
        {
            toggle = !toggle;
            transform.GetChild(0).gameObject.SetActive(toggle);
            transform.GetChild(1).gameObject.SetActive(toggle);
        }
    }

    public void ReloadScene()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}
