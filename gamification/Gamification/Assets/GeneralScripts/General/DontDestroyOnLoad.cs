using UnityEngine;

public class DontDestroyOnLoad : MonoBehaviour
{
	void Awake ()
    {
        DontDestroyOnLoad(this.gameObject);
        Destroy(this);
	}
}
