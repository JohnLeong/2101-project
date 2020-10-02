using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GamificationManager : MonoBehaviour
{
    [SerializeField]
    private GameObject[] buildingCenterPrefabs;

    [SerializeField]
    private GameObject gradeUiPrefab;


    private const float buildingPrefabHeight = 0.5f;

    void Awake()
    {
        CreateBuilding(new Vector3(0.0f, 0.0f, 0.0f), Grade.A);
        CreateBuilding(new Vector3(3.0f, 0.0f, 4.0f), Grade.B);
        CreateBuilding(new Vector3(4.0f, 0.0f, 1.0f), Grade.C);
        CreateBuilding(new Vector3(-4.0f, 0.0f, -3.0f), Grade.D);
        CreateBuilding(new Vector3(1.0f, 0.0f, -4.0f), Grade.E);
    }

    private GameObject CreateBuilding(Vector3 position, Grade grade)
    {
        int height = (int)grade;

        GameObject building = new GameObject();
        building.transform.position = position;

        for (int i = 0; i < height; ++i)
        {
            GameObject go = Instantiate(buildingCenterPrefabs[Random.Range(0, buildingCenterPrefabs.Length)], building.transform);
            go.transform.localPosition += new Vector3(0.0f, i * buildingPrefabHeight, 0.0f);
        }

        GameObject gradeUI = Instantiate(gradeUiPrefab, position + new Vector3(-0.5f, (height + 1) * buildingPrefabHeight, -0.5f), Quaternion.Euler(0.0f, -90.0f, 0.0f), building.transform);
        gradeUI.GetComponent<Text>().text = grade.ToString();

        return building;
    }
}

public enum Grade
{
    A = 12,
    B = 8,
    C = 5,
    D = 3,
    E = 2
}