# Structured Streaming 自定义数据源

资源文件目录添加org.apache.spark.sql.sources.DataSourceRegister文件,用来向spark注册数据源。文件内容为类名org.example.source.LinkedListProvider

org.example.source.LinkedListProvider实现SimpleTableProvider，DataSourceRegister接口。
LinkedListTable实现Table, SupportsRead接口。newScanBuilder方法提供ScanBuilder，用来构造Scan。
LinkedListScan实现Scan。toMicroBatchStream、toContinuousStream提供真正的读取对象。
LinkedListMicroBatchStream实现MicroBatchStream，真正读取数据源。

---
/resources/META-INF/services/org.apache.spark.sql.sources.DataSourceRegister：
```
org.example.source.LinkedListProvider
```
/src目录：
org.example.source.LinkedListProvider
```
public class LinkedListProvider implements SimpleTableProvider, DataSourceRegister {

    private Table table;

    // format:  spark.readStream().format("list").schema(schema).load();
    @Override
    public String shortName() {
        return "list";
    }

    @Override
    public Table getTable(CaseInsensitiveStringMap options) {
        return new LinkedListTable();
    }

    @Override
    public Table getTable(StructType schema, Transform[] partitioning, Map<String, String> properties) {
        return new LinkedListTable(schema);
    }

    @Override
    public StructType inferSchema(CaseInsensitiveStringMap options) {
        return SimpleTableProvider.super.inferSchema(options);
    }

    // 自定义Schema
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

```
org.example.source.LinkedListTable:
```
public class LinkedListTable implements Table, SupportsRead {

    private StructType schema;

    public LinkedListTable() {
        schema = new StructType();
    }

    public LinkedListTable(StructType schema) {
        this.schema = schema;
    }

    @Override
    public ScanBuilder newScanBuilder(CaseInsensitiveStringMap options) {
        return () -> new LinkedListScan(schema);
    }

    @Override
    public String name() {
        return "linkedlist";
    }

    @Override
    public StructType schema() {
        return schema;
    }

    // MICRO_BATCH READ
    @Override
    public Set<TableCapability> capabilities() {
        return Collections.singleton(TableCapability.MICRO_BATCH_READ);
    }
}
```
org.example.source.LinkedListScan:
```
public class LinkedListScan implements Scan {

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

    // ContinuousStream根据需要实现
    @Override
    public ContinuousStream toContinuousStream(String checkpointLocation) {
        throw new RuntimeException("unsupported ContinuousStream");
    }
}
```
org.example.source.LinkedListMicroBatchStream:
```
public class LinkedListMicroBatchStream implements MicroBatchStream, Serializable {

    private StructType schema;


    private volatile boolean running = false;

    public final ListBuffer<InternalRow> dataRows = new ListBuffer<>();
    private LongOffset currentOffset = null;

    private LongOffset lastOffsetCommitted = LongOffset.apply(-1);

    public LinkedListMicroBatchStream(StructType schema) {
        this.schema = schema;
        running = true;
        new Thread(() -> {
            while (running) {
                try {
                    // 读取数据，自定义方式。这里的str用json解析。
                    String str = DataUtils.take();
                    JSONOptions json = new JSONOptions(new HashMap<>(), ZoneId.systemDefault().getId(), null);
                    JacksonParser parser = new JacksonParser(schema,  json, true, new ListBuffer<Filter>().toSeq());

                    FailureSafeParser safeParser = new FailureSafeParser(
                            (input) -> parser.parse(input, (factory, x$1) -> {
                                        try {
                                            return factory.createParser((String) input);
                                        } catch (IOException e) {
                                            throw new RuntimeException(e);
                                        }
                                    },
                                    (s) -> UTF8String.fromString((String) s)),
                            parser.options().parseMode(),
                            schema,
                            parser.options().columnNameOfCorruptRecord());
                    Buffer<InternalRow> buffer = safeParser.parse(str).toBuffer();
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

        ListBuffer<InternalRow> slices = new ListBuffer<>();
        if (sliceEnd >= 0 && sliceStart >= 0) {
            for (int i = sliceStart; i < Math.min(dataRows.size(), sliceEnd); i++) {
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
        return partition -> {
            ListBuffer<InternalRow> slice = ((StringInputPartition) partition).getSlice();

            return new PartitionReader<InternalRow>() {
                private int currentIdx = -1;

                @Override
                public void close() throws IOException {
                }

                @Override
                public boolean next() throws IOException {
                    currentIdx += 1;
                    return currentIdx < slice.size();
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

```