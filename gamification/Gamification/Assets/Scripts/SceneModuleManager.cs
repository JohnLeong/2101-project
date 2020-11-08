using SimpleJSON;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

public class SceneModuleManager : MonoBehaviourSingleton<SceneModuleManager>
{
    [SerializeField]
    private GameObject moduleSelectPrefab = null;

    [SerializeField]
    private float moduleDistanceFromCamera = 10.0f;
    [SerializeField]
    private float cameraRotateDuration = 0.5f;

    private bool rotating = false;
    private int currentModule = 0;
    private List<GameObject> moduleObjects = new List<GameObject>();

    // Start is called before the first frame update
    protected override void Awake()
    {
        base.Awake();
        StartCoroutine(RetrieveModules());
    }

    public void NextModule()
    {
        if (rotating)
            return;

        currentModule = (currentModule + 1) % moduleObjects.Count;
        StartCoroutine(RotateCamera(currentModule * 360 / moduleObjects.Count));
    }

    public void PreviousModule()
    {
        if (rotating)
            return;

        currentModule = currentModule == 0 ? moduleObjects.Count - 1 : currentModule - 1;
        StartCoroutine(RotateCamera(currentModule * 360 / moduleObjects.Count));
    }

    private IEnumerator RotateCamera(float rotateToAngle)
    {
        rotating = true;

        Transform cameraTransform = Camera.main.transform;
        float timer = 0.0f;
        float originalAngle = cameraTransform.localRotation.eulerAngles.y;
        float angle = rotateToAngle - originalAngle;

        while(timer < cameraRotateDuration)
        {
            cameraTransform.localRotation = Quaternion.Euler(0.0f, originalAngle + Easing.Quadratic.Out(timer / cameraRotateDuration) * angle, 0.0f);
            timer += Time.deltaTime;
            yield return null;
        }
        rotating = false;
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
                    go.transform.position = go.transform.forward * moduleDistanceFromCamera;
                    moduleObjects.Add(go);
                    List<string> componentIds = new List<string>();
                    for (int j = 0; j < data[i]["components"].Count; ++j)
                        componentIds.Add(data[i]["components"][j]);
                    ModuleSelect moduleSelect = go.GetComponent<ModuleSelect>();
                    moduleSelect.SetModule(data[i]["_id"], data[i]["name"], data[i]["description"], componentIds);
                }
            }
        }
    }
}
