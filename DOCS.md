<a name="Dtdt"></a>

## Dtdt
<p>This is a Dtdt class. It’s a A test case generator from a “D”ecision “T”ree to “D”ecision “T”able.
Overall flow is the following</p>
<ul>
<li>setContents(contents)</li>
<li>initialize()</li>
<li>printTable()</li>
</ul>

**Kind**: global class  

* [Dtdt](#Dtdt)
    * [new Dtdt()](#new_Dtdt_new)
    * [.setContents(contents)](#Dtdt+setContents) ⇒ [<code>Dtdt</code>](#Dtdt)
    * [.initialize()](#Dtdt+initialize) ⇒ [<code>Dtdt</code>](#Dtdt)
    * [.printTable()](#Dtdt+printTable)
    * [.print()](#Dtdt+print)
    * [._clean()](#Dtdt+_clean)
    * [._parseTree()](#Dtdt+_parseTree)

<a name="new_Dtdt_new"></a>

### new Dtdt()
<p>this._clean()</p>

<a name="Dtdt+setContents"></a>

### dtdt.setContents(contents) ⇒ [<code>Dtdt</code>](#Dtdt)
<p>fill this.contents from outside of this instance</p>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
**Returns**: [<code>Dtdt</code>](#Dtdt) - <p>this This object</p>  

| Param | Type | Description |
| --- | --- | --- |
| contents | <code>string</code> | <p>Target Contents</p> |

<a name="Dtdt+initialize"></a>

### dtdt.initialize() ⇒ [<code>Dtdt</code>](#Dtdt)
<p>In this method, it aims to fill the following parameters</p>
<ul>
<li>this.tree</li>
<li>this.combinations</li>
</ul>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
**Returns**: [<code>Dtdt</code>](#Dtdt) - <p>this This object</p>  
**Access**: public  
<a name="Dtdt+printTable"></a>

### dtdt.printTable()
<p>In this method, it aims to print the following parameters</p>
<ul>
<li>this.matrix</li>
</ul>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
**Access**: public  
<a name="Dtdt+print"></a>

### dtdt.print()
<p>In this method, it aims to print the following parameters</p>
<ul>
<li>this.combinations</li>
</ul>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
**Access**: public  
<a name="Dtdt+_clean"></a>

### dtdt.\_clean()
<p>PRIVATE:clean up all parameters</p>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
<a name="Dtdt+_parseTree"></a>

### dtdt.\_parseTree()
<p>PRIVATE:parse this.tree</p>

**Kind**: instance method of [<code>Dtdt</code>](#Dtdt)  
