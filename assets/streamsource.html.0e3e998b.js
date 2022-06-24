import{_ as e,o as i,a as n,e as s}from"./app.006a6a23.js";const l={},r=s(`<h1 id="structured-streaming-\u81EA\u5B9A\u4E49\u6570\u636E\u6E90" tabindex="-1"><a class="header-anchor" href="#structured-streaming-\u81EA\u5B9A\u4E49\u6570\u636E\u6E90" aria-hidden="true">#</a> Structured Streaming \u81EA\u5B9A\u4E49\u6570\u636E\u6E90</h1><p>\u8D44\u6E90\u6587\u4EF6\u76EE\u5F55\u6DFB\u52A0org.apache.spark.sql.sources.DataSourceRegister\u6587\u4EF6,\u7528\u6765\u5411spark\u6CE8\u518C\u6570\u636E\u6E90\u3002\u6587\u4EF6\u5185\u5BB9\u4E3A\u7C7B\u540Dorg.example.source.LinkedListProvider</p><p>org.example.source.LinkedListProvider\u5B9E\u73B0SimpleTableProvider\uFF0CDataSourceRegister\u63A5\u53E3\u3002 LinkedListTable\u5B9E\u73B0Table, SupportsRead\u63A5\u53E3\u3002newScanBuilder\u65B9\u6CD5\u63D0\u4F9BScanBuilder\uFF0C\u7528\u6765\u6784\u9020Scan\u3002 LinkedListScan\u5B9E\u73B0Scan\u3002toMicroBatchStream\u3001toContinuousStream\u63D0\u4F9B\u771F\u6B63\u7684\u8BFB\u53D6\u5BF9\u8C61\u3002 LinkedListMicroBatchStream\u5B9E\u73B0MicroBatchStream\uFF0C\u771F\u6B63\u8BFB\u53D6\u6570\u636E\u6E90\u3002</p><hr><p>/resources/META-INF/services/org.apache.spark.sql.sources.DataSourceRegister\uFF1A</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>org.example.source.LinkedListProvider
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>/src\u76EE\u5F55\uFF1A org.example.source.LinkedListProvider</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>public class LinkedListProvider implements SimpleTableProvider, DataSourceRegister {

    private Table table;

    // format:  spark.readStream().format(&quot;list&quot;).schema(schema).load();
    @Override
    public String shortName() {
        return &quot;list&quot;;
    }

    @Override
    public Table getTable(CaseInsensitiveStringMap options) {
        return new LinkedListTable();
    }

    @Override
    public Table getTable(StructType schema, Transform[] partitioning, Map&lt;String, String&gt; properties) {
        return new LinkedListTable(schema);
    }

    @Override
    public StructType inferSchema(CaseInsensitiveStringMap options) {
        return SimpleTableProvider.super.inferSchema(options);
    }

    // \u81EA\u5B9A\u4E49Schema
    public boolean supportsExternalMetadata() {
        return true;
    }


    public Table org$apache$spark$sql$internal$connector$SimpleTableProvider$$loadedTable() {
        return table;
    }

    public void org$apache$spark$sql$internal$connector$SimpleTableProvider$$loadedTable_$eq(final Table x$1) {
        this.table = x$1;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>org.example.source.LinkedListTable:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>public class LinkedListTable implements Table, SupportsRead {

    private StructType schema;

    public LinkedListTable() {
        schema = new StructType();
    }

    public LinkedListTable(StructType schema) {
        this.schema = schema;
    }

    @Override
    public ScanBuilder newScanBuilder(CaseInsensitiveStringMap options) {
        return () -&gt; new LinkedListScan(schema);
    }

    @Override
    public String name() {
        return &quot;linkedlist&quot;;
    }

    @Override
    public StructType schema() {
        return schema;
    }

    // MICRO_BATCH READ
    @Override
    public Set&lt;TableCapability&gt; capabilities() {
        return Collections.singleton(TableCapability.MICRO_BATCH_READ);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>org.example.source.LinkedListScan:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>public class LinkedListScan implements Scan {

    StructType schema;

    public LinkedListScan(StructType schema) {
        this.schema = schema;
    }

    @Override
    public StructType readSchema() {
        return schema;
    }

    // MicroBatchStream
    @Override
    public MicroBatchStream toMicroBatchStream(String checkpointLocation) {
        return new LinkedListMicroBatchStream(schema);
    }

    // ContinuousStream\u6839\u636E\u9700\u8981\u5B9E\u73B0
    @Override
    public ContinuousStream toContinuousStream(String checkpointLocation) {
        throw new RuntimeException(&quot;unsupported ContinuousStream&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>org.example.source.LinkedListMicroBatchStream:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>public class LinkedListMicroBatchStream implements MicroBatchStream, Serializable {

    private StructType schema;


    private volatile boolean running = false;

    public final ListBuffer&lt;InternalRow&gt; dataRows = new ListBuffer&lt;&gt;();
    private LongOffset currentOffset = null;

    private LongOffset lastOffsetCommitted = LongOffset.apply(-1);

    public LinkedListMicroBatchStream(StructType schema) {
        this.schema = schema;
        running = true;
        new Thread(() -&gt; {
            while (running) {
                try {
                    // \u8BFB\u53D6\u6570\u636E\uFF0C\u81EA\u5B9A\u4E49\u65B9\u5F0F\u3002\u8FD9\u91CC\u7684str\u7528json\u89E3\u6790\u3002
                    String str = DataUtils.take();
                    JSONOptions json = new JSONOptions(new HashMap&lt;&gt;(), ZoneId.systemDefault().getId(), null);
                    JacksonParser parser = new JacksonParser(schema,  json, true, new ListBuffer&lt;Filter&gt;().toSeq());

                    FailureSafeParser safeParser = new FailureSafeParser(
                            (input) -&gt; parser.parse(input, (factory, x$1) -&gt; {
                                        try {
                                            return factory.createParser((String) input);
                                        } catch (IOException e) {
                                            throw new RuntimeException(e);
                                        }
                                    },
                                    (s) -&gt; UTF8String.fromString((String) s)),
                            parser.options().parseMode(),
                            schema,
                            parser.options().columnNameOfCorruptRecord());
                    Buffer&lt;InternalRow&gt; buffer = safeParser.parse(str).toBuffer();
                    dataRows.appendAll(buffer);
                    currentOffset = Optional.ofNullable(currentOffset).orElse(LongOffset.apply(-1)).$plus(buffer.size());
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }).start();
    }

    @Override
    public Offset latestOffset() {
        return currentOffset;
    }

    @Override
    public InputPartition[] planInputPartitions(Offset start, Offset end) {
        long startOrdinal = ((LongOffset) start).offset() + 1;
        long endOrdinal = ((LongOffset) end).offset() + 1;

        int sliceStart = (int) (startOrdinal - lastOffsetCommitted.offset() - 1);
        int sliceEnd = (int) (endOrdinal - lastOffsetCommitted.offset() - 1);

        ListBuffer&lt;InternalRow&gt; slices = new ListBuffer&lt;&gt;();
        if (sliceEnd &gt;= 0 &amp;&amp; sliceStart &gt;= 0) {
            for (int i = sliceStart; i &lt; Math.min(dataRows.size(), sliceEnd); i++) {
                slices.append(dataRows.apply(i));
            }
        }
        if (slices.isEmpty()) {
            return new InputPartition[0];
        }
        return new InputPartition[]{ new StringInputPartition(slices) };
    }

    @Override
    public PartitionReaderFactory createReaderFactory() {
        return partition -&gt; {
            ListBuffer&lt;InternalRow&gt; slice = ((StringInputPartition) partition).getSlice();

            return new PartitionReader&lt;InternalRow&gt;() {
                private int currentIdx = -1;

                @Override
                public void close() throws IOException {
                }

                @Override
                public boolean next() throws IOException {
                    currentIdx += 1;
                    return currentIdx &lt; slice.size();
                }

                @Override
                public InternalRow get() {
                    return slice.apply(currentIdx);
                }
            };
        };
    }

    @Override
    public Offset initialOffset() {
        return LongOffset.apply(-1);
    }

    @Override
    public Offset deserializeOffset(String json) {
        return new LongOffset(Long.parseLong(json));
    }

    @Override
    public void commit(Offset end) {
        LongOffset newOffset = (LongOffset) end;

        long offsetDiff = (newOffset.offset() - lastOffsetCommitted.offset());

        dataRows.trimStart((int) offsetDiff);
        lastOffsetCommitted = newOffset;
    }

    @Override
    public void stop() {
        running = false;
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),d=[r];function a(v,t){return i(),n("div",null,d)}var u=e(l,[["render",a],["__file","streamsource.html.vue"]]);export{u as default};
