using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

public class ComponentInfo : MonoBehaviour
{
    [SerializeField]
    private Text componentName = null;
    [SerializeField]
    private Text componentType = null;
    [SerializeField]
    private Text componentComments = null;

    public void Display(ModuleComponent component)
    {
        gameObject.SetActive(true);
        componentName.text = component.Name;
        componentType.text = component.Type;

        //Build comments
        StringBuilder builder = new StringBuilder();

        builder.Append("Summative comments\n\n");
        foreach (var comment in component.SummativeComments)
        {
            builder.Append(comment.Date);
            builder.Append("\n");
            builder.Append(comment.Body);
            builder.Append("\n\n");
        }

        builder.Append("--------------------------------------------------------------------------------\nFormative comments\n\n");
        foreach (var comment in component.FormativeComments)
        {
            builder.Append(comment.Date);
            builder.Append("\n");
            builder.Append(comment.Body);
            builder.Append("\n\n");
        }

        componentComments.text = builder.ToString();
    }

    public void Close()
    {
        gameObject.SetActive(false);
    }
}
