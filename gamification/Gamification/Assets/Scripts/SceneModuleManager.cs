using SimpleJSON;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class SceneModuleManager : MonoBehaviour
{
    [SerializeField]
    private GameObject moduleSelectPrefab = null;

    // Start is called before the first frame update
    void Awake()
    {
        StartCoroutine(RetrieveModules());
    }

    IEnumerator RetrieveModules()
    {
        WWWForm form = new WWWForm();
        
        using (UnityWebRequest www = UnityWebRequest.Get(Routes.getModulesUrl))
        {
            www.SetRequestHeader("Authorization", GameManager.Instance.AccessToken);
            yield return www.SendWebRequest();

            if (www.isNetworkError || www.isHttpError)
            {
                Debug.Log("Failed to retreive modules" + www.error);
            }
            else
            {
                Debug.Log("Successfully retrieved modules!");
                string contents = www.downloadHandler.text;

                var data = JSON.Parse(contents);            //Parse contents into JSON
                int rotationSpacing = 360 / data.Count;     //Rotation in between buildings

                for (int i = 0; i < data.Count; ++i)
                {
                    GameObject go = Instantiate(moduleSelectPrefab, new Vector3(), Quaternion.Euler(0.0f, i * rotationSpacing, 0.0f));
                    go.transform.position = go.transform.forward * 10.0f;
                    List<string> componentIds = new List<string>();
                    for (int j = 0; j < data[i]["components"].Count; ++j)
                        componentIds.Add(data[i]["components"][j]);
                    go.AddComponent<ModuleSelect>().SetModule(data[i]["_id"], data[i]["name"], data[i]["description"], componentIds);
                }
            }
        }
    }
}
