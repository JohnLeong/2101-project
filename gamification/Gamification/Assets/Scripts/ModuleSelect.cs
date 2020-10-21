using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class ModuleSelect : MonoBehaviour
{
    private Color mouseOverColor = Color.red;
    private List<Color> originalColors = new List<Color>();
    private Module module = new Module();

    private void Awake()
    {
        MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>();
        foreach (var r in renderers)
            originalColors.Add(r.material.color);
    }

    private void OnMouseOver()
    {
        MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>();
        foreach (var r in renderers)
            r.material.color = mouseOverColor;
    }

    private void OnMouseExit()
    {
        MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>();
        for (int i = 0; i < renderers.Length; ++i)
            renderers[i].material.color = originalColors[i];
    }

    private void OnMouseDown()
    {
        GameManager.Instance.Module.Id = module.Id;
        GameManager.Instance.Module.Name = module.Name;
        GameManager.Instance.Module.Description = module.Description;
        GameManager.Instance.Module.ComponentIds = module.ComponentIds;
        SceneManager.LoadScene("SceneGamification");
    }

    public void SetModule(string moduleId, string moduleName, string moduleDescription, List<string> componentIds)
    {
        module.Id = moduleId;
        module.Name = moduleName;
        module.Description = moduleDescription;
        module.ComponentIds = componentIds;
        transform.Find("Heading").GetComponent<Text>().text = moduleName;
    }
}
