using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Module
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<string> ComponentIds { get; set; }

    public Module()
    {
    }
}