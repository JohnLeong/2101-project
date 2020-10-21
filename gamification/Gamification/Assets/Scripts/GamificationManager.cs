using SimpleJSON;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class GamificationManager : MonoBehaviourSingleton<GamificationManager>
{
    [Header("Scene objects")]
    [SerializeField]
    private ComponentInfo componentInfoPanel = null;
    [SerializeField]
    private SubcomponentInfo subComponentInfoPanel = null;

    [Header("Prefabs")]
    [SerializeField]
    private GameObject[] buildingCenterPrefabs = null;
    [SerializeField]
    private GameObject[] buildingBottomPrefabs = null;
    [SerializeField]
    private GameObject[] buildingRoofPrefabs = null;
    [SerializeField]
    private GameObject buildingSeperatorPrefab = null;
    [SerializeField]
    private GameObject buildingIndicatorPrefab = null;
    [SerializeField]
    private GameObject dividerPrefab = null;
    [SerializeField]
    private GameObject hologramPrefab = null;

    [SerializeField]
    private Color[] standingColors = null;

    private const int maxSubcomponentHeight = 10;
    private const float buildingCenterHeight = 0.625f;
    private const float buildingBottomHeight = 0.838f;
    private const float buildingHorizontalSpacing = 4.0f;

    private List<ModuleComponent> components;

    protected override void Awake()
    {
        base.Awake();

        LoadStudentDetails();
    }

    private GameObject CreateBuildingObject(Vector3 position, ModuleComponent component)
    {
        GameObject building = new GameObject();
        building.AddComponent<Building>().Component = component;
        building.transform.position = position;

        float currentHeight = buildingBottomHeight;
        Color standingColor = GetStandingColor(component.ClassStandingPercentile);
        int hologramHeight = 0;

        //go.transform.GetComponent<MeshRenderer>().material.color = standingColor;

        //Create building base
        Instantiate(buildingBottomPrefabs[Random.Range(0, buildingBottomPrefabs.Length)], building.transform);

        //Create building center
        for (int i = 0; i < component.SubComponents.Count; ++i)
        {
            SubComponent subComponent = component.SubComponents[i];
            int subComponentHeight = (int)(((float)subComponent.Marks / subComponent.TotalMarks) * maxSubcomponentHeight);
            hologramHeight += maxSubcomponentHeight - subComponentHeight;

            GameObject subComponentObject = new GameObject("Subcomponent: " + subComponent.Name);
            subComponentObject.AddComponent<BuildingSubcomponent>();
            subComponentObject.transform.SetParent(building.transform, false);
            subComponentObject.transform.localPosition += new Vector3(0.0f, currentHeight);

            BoxCollider collider = subComponentObject.AddComponent<BoxCollider>();
            collider.size = new Vector3(1.0f, buildingCenterHeight * subComponentHeight, 1.0f);
            collider.center = new Vector3(0.0f, buildingCenterHeight * subComponentHeight * 0.45f, 0.0f);


            for (int j = 0; j < subComponentHeight; ++j)
            {
                GameObject go = Instantiate(buildingCenterPrefabs[Random.Range(0, buildingCenterPrefabs.Length)], subComponentObject.transform);
                go.transform.position = new Vector3(go.transform.position.x, currentHeight, go.transform.position.z);
                currentHeight += buildingCenterHeight;
            }

            //If not the last subcomponent, add a divider
            if (i + 1 < component.SubComponents.Count)
            {
                GameObject divider = Instantiate(dividerPrefab, building.transform);
                divider.transform.localPosition += new Vector3(0.0f, currentHeight);
            }

            foreach (var item in subComponentObject.GetComponentsInChildren<MeshRenderer>())
                item.material.color = standingColor;
            subComponentObject.GetComponent<BuildingSubcomponent>().Initialise(subComponent);
        }

        //Create building roof
        GameObject roof = Instantiate(buildingRoofPrefabs[Random.Range(0, buildingRoofPrefabs.Length)], building.transform);
        roof.transform.localPosition += new Vector3(0.0f, currentHeight);

        //Create building indicator
        GameObject indicator = Instantiate(buildingIndicatorPrefab, building.transform);
        indicator.transform.localPosition += new Vector3(0.0f, currentHeight + 1.0f);

        //Create building hologram
        for (int i = 0; i < hologramHeight; ++i)
        {
            GameObject hologram = Instantiate(hologramPrefab, building.transform);
            hologram.transform.localPosition += new Vector3(0.0f, currentHeight);
            currentHeight += buildingCenterHeight;
        }

        return building;
    }

    private void LoadStudentDetails()
    {
        components = new List<ModuleComponent>();

        StartCoroutine(RetrieveComponents());

        ////For testing
        //// string testData = "30,1,10_50,2,100,90_50,1,100,95+70,5,10_50,2,100,90_50,1,100,95";
        //string testData = GameObject.Find("DebugInput").GetComponent<InputField>().text;
        //var coms = testData.Split('+');
        //foreach (string com in coms)
        //{
        //    List<SubComponent> subComponents = new List<SubComponent>();
        //    var subs = com.Split('_');
        //    var comData = subs[0].Split(',');

        //    for (int i = 1; i < subs.Length; ++i)
        //    {
        //        var subData = subs[i].Split(',');
        //        subComponents.Add(new SubComponent(int.Parse(subData[0]), int.Parse(subData[1]), int.Parse(subData[2]), int.Parse(subData[3])));
        //    }

        //    //components.Add(new Component(int.Parse(comData[0]), int.Parse(comData[1]), int.Parse(comData[2]), subComponents));
        //}
    }

    private void GenerateBuildings()
    {
        for (int i = 0; i < components.Count; ++i)
            CreateBuildingObject(new Vector3(i * buildingHorizontalSpacing, 0.0f, 0.0f), components[i]);
    }

    private Color GetStandingColor(float standingPercentile)
    {
        if (standingPercentile < 10.0f)
            return standingColors[0];
        if (standingPercentile < 51.0f)
            return standingColors[1];

        return standingColors[standingColors.Length - 1];
    }

    public void DisplayComponentInfo(ModuleComponent component)
    {
        componentInfoPanel.Display(component);
    }

    public void DisplaySubComponentInfo(SubComponent subcomponent)
    {
        //subComponentInfoPanel.Display(subcomponent);
    }


    IEnumerator RetrieveComponents()
    {
        WWWForm form = new WWWForm();

        using (UnityWebRequest www = UnityWebRequest.Get(Routes.getComponentUrl + GameManager.Instance.Module.Id))
        {
            www.SetRequestHeader("Authorization", GameManager.Instance.AccessToken);
            yield return www.SendWebRequest();

            if (www.isNetworkError || www.isHttpError)
                Debug.Log("Failed to retreive modules" + www.error);
            else
            {
                Debug.Log("Successfully retrieved components!");
                string contents = www.downloadHandler.text;

                var data = JSON.Parse(contents);            //Parse contents into JSON

                //Loop through all components
                for (int i = 0; i < data.Count; ++i)
                {
                    var componentJson = data[i];         
                    List<SubComponent> subcomponents = new List<SubComponent>();
                    List<Comment> summativeComments = new List<Comment>();
                    List<Comment> formativeComments = new List<Comment>();

                    //Read comments
                    for (int j = 0; j < componentJson["summativeComments"].Count; ++j)
                    {
                        var comment = componentJson["summativeComments"][j];
                        summativeComments.Add(new Comment(comment["datePosted"].ToString().Substring(1, 10), comment["body"]));
                    }
                    for (int j = 0; j < componentJson["formativeComments"].Count; ++j)
                    {
                        var comment = componentJson["formativeComments"][j];
                        formativeComments.Add(new Comment(comment["datePosted"].ToString().Substring(1, 10), comment["body"]));
                    }

                    //Read subcomponents
                    subcomponents.Add(new SubComponent("testing", 30, 1, 100, 60));
                    subcomponents.Add(new SubComponent("testing", 30, 1, 100, 60));
                    subcomponents.Add(new SubComponent("testing", 40, 1, 100, 80));

                    var test = componentJson["standingPercentile"];

                    components.Add(new ModuleComponent(componentJson["name"], componentJson["componentType"], componentJson["weightage"]
                        , componentJson["standingPercentile"], componentJson["numClassStudents"]
                        , subcomponents, formativeComments, summativeComments));
                }
            }
        }
        GenerateBuildings();
    }
}