import { Zodios, type ZodiosOptions, makeApi } from "@zodios/core";
import { z } from "zod";

const StateVersion = z.number();
const Address = z.string();
const Height = z.string();
const PublicKey = z.string();
const AccountTypeEnum = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
const AccountLinkPublicKeyDTO = z.object({ publicKey: z.string() }).passthrough();
const FinalizationEpoch = z.number();
const AccountLinkVotingKeyDTO = z
  .object({
    publicKey: z.string(),
    startEpoch: FinalizationEpoch.int(),
    endEpoch: FinalizationEpoch.int(),
  })
  .passthrough();
const AccountLinkVotingKeysDTO = z.object({ publicKeys: z.array(AccountLinkVotingKeyDTO) }).passthrough();
const SupplementalPublicKeysDTO = z
  .object({
    linked: AccountLinkPublicKeyDTO,
    node: AccountLinkPublicKeyDTO,
    vrf: AccountLinkPublicKeyDTO,
    voting: AccountLinkVotingKeysDTO,
  })
  .partial()
  .passthrough();
const Amount = z.string();
const UInt32 = z.number();
const Importance = z.string();
const ActivityBucketDTO = z
  .object({
    startHeight: Height,
    totalFeesPaid: Amount,
    beneficiaryCount: UInt32.int(),
    rawScore: Importance,
  })
  .passthrough();
const MosaicId = z.string();
const Mosaic = z.object({ id: MosaicId, amount: Amount }).passthrough();
const AccountDTO = z
  .object({
    version: StateVersion.int(),
    address: Address,
    addressHeight: Height,
    publicKey: PublicKey,
    publicKeyHeight: Height,
    accountType: AccountTypeEnum,
    supplementalPublicKeys: SupplementalPublicKeysDTO,
    activityBuckets: z.array(ActivityBucketDTO),
    mosaics: z.array(Mosaic),
    importance: Importance,
    importanceHeight: Height,
  })
  .passthrough();
const AccountInfoDTO = z.object({ id: z.string(), account: AccountDTO }).passthrough();
const Pagination = z.object({ pageNumber: z.number().int(), pageSize: z.number().int() }).passthrough();
const AccountPage = z.object({ data: z.array(AccountInfoDTO), pagination: Pagination }).passthrough();
const ModelError = z.object({ code: z.string(), message: z.string() }).passthrough();
const accountIds = z
  .object({ publicKeys: z.array(PublicKey), addresses: z.array(Address) })
  .partial()
  .passthrough();
const MerkleTreeRaw = z.string();
const MerkleTreeNodeTypeEnum = z.union([z.literal(0), z.literal(255)]);
const Hash256 = z.string();
const MerkleTreeBranchLinkDTO = z.object({ bit: z.string(), link: Hash256 }).passthrough();
const MerkleTreeBranchDTO = z
  .object({
    type: MerkleTreeNodeTypeEnum,
    path: z.string(),
    encodedPath: z.string(),
    nibbleCount: z.number().int(),
    linkMask: z.string(),
    links: z.array(MerkleTreeBranchLinkDTO),
    branchHash: Hash256,
  })
  .passthrough();
const MerkleTreeLeafDTO = z
  .object({
    type: MerkleTreeNodeTypeEnum,
    path: z.string(),
    encodedPath: z.string(),
    nibbleCount: z.number().int(),
    value: z.string(),
    leafHash: Hash256,
  })
  .passthrough();
const MerkleStateInfoDTO = z
  .object({
    raw: MerkleTreeRaw,
    tree: z.array(z.union([MerkleTreeBranchDTO, MerkleTreeLeafDTO])),
  })
  .passthrough();
const BlockMetaDTO = z
  .object({
    hash: Hash256,
    totalFee: Amount,
    generationHash: Hash256,
    stateHashSubCacheMerkleRoots: z.array(Hash256),
    totalTransactionsCount: z.number().int(),
    transactionsCount: z.number().int(),
    statementsCount: z.number().int(),
  })
  .passthrough();
const SizePrefixedEntityDTO = z.object({ size: UInt32.int() }).passthrough();
const Signature = z.string();
const VerifiableEntityDTO = z.object({ signature: Signature }).passthrough();
const NetworkTypeEnum = z.union([z.literal(104), z.literal(152)]);
const EntityDTO = z
  .object({
    signerPublicKey: PublicKey,
    version: z.number().int(),
    network: NetworkTypeEnum,
    type: z.number().int(),
  })
  .passthrough();
const Timestamp = z.string();
const Difficulty = z.string();
const ProofGamma = z.string();
const ProofVerificationHash = z.string();
const ProofScalar = z.string();
const BlockFeeMultiplier = z.number();
const BlockDTO = SizePrefixedEntityDTO.and(VerifiableEntityDTO)
  .and(EntityDTO)
  .and(
    z
      .object({
        height: Height,
        timestamp: Timestamp,
        difficulty: Difficulty,
        proofGamma: ProofGamma,
        proofVerificationHash: ProofVerificationHash,
        proofScalar: ProofScalar,
        previousBlockHash: Hash256,
        transactionsHash: Hash256,
        receiptsHash: Hash256,
        stateHash: Hash256,
        beneficiaryAddress: Address,
        feeMultiplier: BlockFeeMultiplier.int(),
      })
      .passthrough(),
  );
const UInt64 = z.string();
const ImportanceBlockDTO = BlockDTO.and(
  z
    .object({
      votingEligibleAccountsCount: UInt32.int(),
      harvestingEligibleAccountsCount: UInt64,
      totalVotingBalance: Amount,
      previousImportanceBlockHash: Hash256,
    })
    .passthrough(),
);
const BlockInfoDTO = z
  .object({
    id: z.string(),
    meta: BlockMetaDTO,
    block: z.union([BlockDTO, ImportanceBlockDTO]),
  })
  .passthrough();
const BlockPage = z.object({ data: z.array(BlockInfoDTO), pagination: Pagination }).passthrough();
const PositionEnum = z.enum(["left", "right"]);
const MerklePathItemDTO = z.object({ position: PositionEnum, hash: Hash256 }).partial().passthrough();
const MerkleProofInfoDTO = z
  .object({ merklePath: z.array(MerklePathItemDTO) })
  .partial()
  .passthrough();
const Score = z.string();
const FinalizationPoint = z.number();
const FinalizedBlockDTO = z
  .object({
    finalizationEpoch: FinalizationEpoch.int(),
    finalizationPoint: FinalizationPoint.int(),
    height: Height,
    hash: Hash256,
  })
  .passthrough();
const ChainInfoDTO = z
  .object({
    height: Height,
    scoreHigh: Score,
    scoreLow: Score,
    latestFinalizedBlock: FinalizedBlockDTO,
  })
  .passthrough();
const StageEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const ParentPublicKeySignaturePair = z.object({ parentPublicKey: PublicKey, signature: Signature }).passthrough();
const BmTreeSignature = z
  .object({
    root: ParentPublicKeySignaturePair,
    bottom: ParentPublicKeySignaturePair,
  })
  .passthrough();
const MessageGroup = z
  .object({
    stage: StageEnum,
    height: Height,
    hashes: z.array(Hash256),
    signatures: z.array(BmTreeSignature),
  })
  .passthrough();
const FinalizationProofDTO = z
  .object({
    version: z.number().int(),
    finalizationEpoch: FinalizationEpoch.int(),
    finalizationPoint: FinalizationPoint.int(),
    height: Height,
    hash: Hash256,
    messageGroups: z.array(MessageGroup),
  })
  .passthrough();
const NetworkTypeDTO = z.object({ name: z.string(), description: z.string() }).passthrough();
const RentalFeesDTO = z
  .object({
    effectiveRootNamespaceRentalFeePerBlock: Amount,
    effectiveChildNamespaceRentalFee: Amount,
    effectiveMosaicRentalFee: Amount,
  })
  .passthrough();
const TransactionFeesDTO = z
  .object({
    averageFeeMultiplier: BlockFeeMultiplier.int(),
    medianFeeMultiplier: BlockFeeMultiplier.int(),
    highestFeeMultiplier: BlockFeeMultiplier.int(),
    lowestFeeMultiplier: BlockFeeMultiplier.int(),
    minFeeMultiplier: BlockFeeMultiplier.int(),
  })
  .passthrough();
const NodeIdentityEqualityStrategy = z.enum(["host", "public-key"]);
const NetworkPropertiesDTO = z
  .object({
    identifier: z.string(),
    nodeEqualityStrategy: NodeIdentityEqualityStrategy,
    nemesisSignerPublicKey: PublicKey,
    generationHashSeed: Hash256,
    epochAdjustment: z.string(),
  })
  .partial()
  .passthrough();
const ChainPropertiesDTO = z
  .object({
    enableVerifiableState: z.boolean(),
    enableVerifiableReceipts: z.boolean(),
    currencyMosaicId: z.string(),
    harvestingMosaicId: z.string(),
    blockGenerationTargetTime: z.string(),
    blockTimeSmoothingFactor: z.string(),
    blockFinalizationInterval: z.string(),
    importanceGrouping: z.string(),
    importanceActivityPercentage: z.string(),
    maxRollbackBlocks: z.string(),
    maxDifficultyBlocks: z.string(),
    defaultDynamicFeeMultiplier: z.string(),
    maxTransactionLifetime: z.string(),
    maxBlockFutureTime: z.string(),
    initialCurrencyAtomicUnits: z.string(),
    maxMosaicAtomicUnits: z.string(),
    totalChainImportance: z.string(),
    minHarvesterBalance: z.string(),
    maxHarvesterBalance: z.string(),
    minVoterBalance: z.string(),
    maxVotingKeysPerAccount: z.string(),
    minVotingKeyLifetime: z.string(),
    maxVotingKeyLifetime: z.string(),
    harvestBeneficiaryPercentage: z.string(),
    harvestNetworkPercentage: z.string(),
    harvestNetworkFeeSinkAddress: Address,
    blockPruneInterval: z.string(),
    maxTransactionsPerBlock: z.string(),
  })
  .partial()
  .passthrough();
const AccountKeyLinkNetworkPropertiesDTO = z.object({ dummy: z.string() }).partial().passthrough();
const AggregateNetworkPropertiesDTO = z
  .object({
    maxTransactionsPerAggregate: z.string(),
    maxCosignaturesPerAggregate: z.string(),
    enableStrictCosignatureCheck: z.boolean(),
    enableBondedAggregateSupport: z.boolean(),
    maxBondedTransactionLifetime: z.string(),
  })
  .partial()
  .passthrough();
const HashLockNetworkPropertiesDTO = z
  .object({
    lockedFundsPerAggregate: z.string(),
    maxHashLockDuration: z.string(),
  })
  .partial()
  .passthrough();
const SecretLockNetworkPropertiesDTO = z
  .object({
    maxSecretLockDuration: z.string(),
    minProofSize: z.string(),
    maxProofSize: z.string(),
  })
  .partial()
  .passthrough();
const MetadataNetworkPropertiesDTO = z.object({ maxValueSize: z.string() }).partial().passthrough();
const MosaicNetworkPropertiesDTO = z
  .object({
    maxMosaicsPerAccount: z.string(),
    maxMosaicDuration: z.string(),
    maxMosaicDivisibility: z.string(),
    mosaicRentalFeeSinkAddress: Address,
    mosaicRentalFee: z.string(),
  })
  .partial()
  .passthrough();
const MultisigNetworkPropertiesDTO = z
  .object({
    maxMultisigDepth: z.string(),
    maxCosignatoriesPerAccount: z.string(),
    maxCosignedAccountsPerAccount: z.string(),
  })
  .partial()
  .passthrough();
const NamespaceNetworkPropertiesDTO = z
  .object({
    maxNameSize: z.string(),
    maxChildNamespaces: z.string(),
    maxNamespaceDepth: z.string(),
    minNamespaceDuration: z.string(),
    maxNamespaceDuration: z.string(),
    namespaceGracePeriodDuration: z.string(),
    reservedRootNamespaceNames: z.string(),
    namespaceRentalFeeSinkAddress: Address,
    rootNamespaceRentalFeePerBlock: z.string(),
    childNamespaceRentalFee: z.string(),
  })
  .partial()
  .passthrough();
const AccountRestrictionNetworkPropertiesDTO = z.object({ maxAccountRestrictionValues: z.string() }).partial().passthrough();
const MosaicRestrictionNetworkPropertiesDTO = z.object({ maxMosaicRestrictionValues: z.string() }).partial().passthrough();
const TransferNetworkPropertiesDTO = z.object({ maxMessageSize: z.string() }).partial().passthrough();
const PluginsPropertiesDTO = z
  .object({
    accountlink: AccountKeyLinkNetworkPropertiesDTO,
    aggregate: AggregateNetworkPropertiesDTO,
    lockhash: HashLockNetworkPropertiesDTO,
    locksecret: SecretLockNetworkPropertiesDTO,
    metadata: MetadataNetworkPropertiesDTO,
    mosaic: MosaicNetworkPropertiesDTO,
    multisig: MultisigNetworkPropertiesDTO,
    namespace: NamespaceNetworkPropertiesDTO,
    restrictionaccount: AccountRestrictionNetworkPropertiesDTO,
    restrictionmosaic: MosaicRestrictionNetworkPropertiesDTO,
    transfer: TransferNetworkPropertiesDTO,
  })
  .partial()
  .passthrough();
const NetworkConfigurationDTO = z
  .object({
    network: NetworkPropertiesDTO,
    chain: ChainPropertiesDTO,
    plugins: PluginsPropertiesDTO,
  })
  .passthrough();
const NodeStatusEnum = z.enum(["up", "down"]);
const NodeHealthDTO = z.object({ apiNode: NodeStatusEnum, db: NodeStatusEnum }).passthrough();
const NodeHealthInfoDTO = z.object({ status: NodeHealthDTO }).passthrough();
const RolesTypeEnum = z.number();
const NodeInfoDTO = z
  .object({
    version: z.number().int(),
    publicKey: PublicKey,
    networkGenerationHashSeed: Hash256,
    roles: RolesTypeEnum.int(),
    port: z.number().int(),
    networkIdentifier: z.number().int(),
    friendlyName: z.string(),
    host: z.string(),
    nodePublicKey: PublicKey.optional(),
  })
  .passthrough();
const StorageInfoDTO = z
  .object({
    numBlocks: z.number().int(),
    numTransactions: z.number().int(),
    numAccounts: z.number().int(),
  })
  .passthrough();
const CommunicationTimestampsDTO = z.object({ sendTimestamp: Timestamp, receiveTimestamp: Timestamp }).partial().passthrough();
const NodeTimeDTO = z.object({ communicationTimestamps: CommunicationTimestampsDTO }).passthrough();
const DeploymentDTO = z
  .object({
    deploymentTool: z.string(),
    deploymentToolVersion: z.string(),
    lastUpdatedDate: z.string(),
  })
  .passthrough();
const ServerDTO = z
  .object({
    restVersion: z.string(),
    sdkVersion: z.string(),
    deployment: DeploymentDTO,
  })
  .passthrough();
const ServerInfoDTO = z.object({ serverInfo: ServerDTO }).passthrough();
const UnlockedAccountDTO = z.object({ unlockedAccount: z.array(PublicKey) }).passthrough();
const transactionPayload = z.object({ payload: z.string() }).partial().passthrough();
const AnnounceTransactionInfoDTO = z.object({ message: z.string() }).passthrough();
const TransactionTypeEnum = z.union([
  z.literal(16716),
  z.literal(16963),
  z.literal(16707),
  z.literal(16972),
  z.literal(16705),
  z.literal(16961),
  z.literal(16717),
  z.literal(16973),
  z.literal(17229),
  z.literal(16718),
  z.literal(16974),
  z.literal(17230),
  z.literal(16708),
  z.literal(16964),
  z.literal(17220),
  z.literal(16725),
  z.literal(16712),
  z.literal(16722),
  z.literal(16978),
  z.literal(16720),
  z.literal(16976),
  z.literal(17232),
  z.literal(16721),
  z.literal(16977),
  z.literal(16724),
]);
const TransactionMetaDTO = z
  .object({
    height: Height,
    hash: Hash256,
    merkleComponentHash: Hash256,
    index: z.number().int(),
    timestamp: Timestamp.optional(),
    feeMultiplier: BlockFeeMultiplier.int().optional(),
  })
  .passthrough();
const EmbeddedTransactionMetaDTO = z
  .object({
    height: Height,
    aggregateHash: Hash256,
    aggregateId: z.string(),
    index: z.number().int(),
    timestamp: Timestamp.optional(),
    feeMultiplier: BlockFeeMultiplier.int().optional(),
  })
  .passthrough();
const BlockDuration = z.string();
const TransactionBodyDTO = z.object({ maxFee: Amount, deadline: BlockDuration }).passthrough();
const TransactionDTO = SizePrefixedEntityDTO.and(VerifiableEntityDTO).and(EntityDTO).and(TransactionBodyDTO);
const LinkActionEnum = z.union([z.literal(0), z.literal(1)]);
const AccountKeyLinkTransactionBodyDTO = z.object({ linkedPublicKey: PublicKey, linkAction: LinkActionEnum }).passthrough();
const AccountKeyLinkTransactionDTO = TransactionDTO.and(AccountKeyLinkTransactionBodyDTO);
const EmbeddedTransactionDTO = EntityDTO;
const EmbeddedAccountKeyLinkTransactionDTO = EmbeddedTransactionDTO.and(AccountKeyLinkTransactionBodyDTO);
const NodeKeyLinkTransactionBodyDTO = z.object({ linkedPublicKey: PublicKey, linkAction: LinkActionEnum }).passthrough();
const NodeKeyLinkTransactionDTO = TransactionDTO.and(NodeKeyLinkTransactionBodyDTO);
const EmbeddedNodeKeyLinkTransactionDTO = EmbeddedTransactionDTO.and(NodeKeyLinkTransactionBodyDTO);
const VrfKeyLinkTransactionBodyDTO = z.object({ linkedPublicKey: PublicKey, linkAction: LinkActionEnum }).passthrough();
const VrfKeyLinkTransactionDTO = TransactionDTO.and(VrfKeyLinkTransactionBodyDTO);
const EmbeddedVrfKeyLinkTransactionDTO = EmbeddedTransactionDTO.and(VrfKeyLinkTransactionBodyDTO);
const VotingKey = z.string();
const VotingKeyLinkTransactionBodyDTO = z
  .object({
    linkedPublicKey: VotingKey,
    startEpoch: FinalizationEpoch.int(),
    endEpoch: FinalizationEpoch.int(),
    linkAction: LinkActionEnum,
  })
  .passthrough();
const VotingKeyLinkTransactionDTO = TransactionDTO.and(VotingKeyLinkTransactionBodyDTO);
const EmbeddedVotingKeyLinkTransactionDTO = EmbeddedTransactionDTO.and(VotingKeyLinkTransactionBodyDTO);
const CosignatureVersion = z.string();
const CosignatureDTO = VerifiableEntityDTO.and(z.object({ version: CosignatureVersion, signerPublicKey: PublicKey }).passthrough());
const AggregateTransactionBodyDTO = z.object({ transactionsHash: Hash256, cosignatures: z.array(CosignatureDTO) }).passthrough();
const AggregateTransactionDTO = TransactionDTO.and(AggregateTransactionBodyDTO);
const UnresolvedMosaicId = z.string();
const HashLockTransactionBodyDTO = z
  .object({
    mosaicId: UnresolvedMosaicId,
    amount: Amount,
    duration: BlockDuration,
    hash: Hash256,
  })
  .passthrough();
const EmbeddedHashLockTransactionDTO = EmbeddedTransactionDTO.and(HashLockTransactionBodyDTO);
const UnresolvedAddress = z.string();
const LockHashAlgorithmEnum_ = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const SecretLockTransactionBodyDTO = z
  .object({
    recipientAddress: UnresolvedAddress,
    secret: Hash256,
    mosaicId: UnresolvedMosaicId,
    amount: Amount,
    duration: BlockDuration,
    hashAlgorithm: LockHashAlgorithmEnum_,
  })
  .passthrough();
const EmbeddedSecretLockTransactionDTO = EmbeddedTransactionDTO.and(SecretLockTransactionBodyDTO);
const SecretProofTransactionBodyDTO = z
  .object({
    recipientAddress: UnresolvedAddress,
    secret: Hash256,
    hashAlgorithm: LockHashAlgorithmEnum_,
    proof: z.string(),
  })
  .passthrough();
const EmbeddedSecretProofTransactionDTO = EmbeddedTransactionDTO.and(SecretProofTransactionBodyDTO);
const MetadataKey = z.string();
const MetadataValue = z.string();
const AccountMetadataTransactionBodyDTO = z
  .object({
    targetAddress: UnresolvedAddress,
    scopedMetadataKey: MetadataKey,
    valueSizeDelta: z.number().int(),
    valueSize: UInt32.int(),
    value: MetadataValue,
  })
  .passthrough();
const EmbeddedAccountMetadataTransactionDTO = EmbeddedTransactionDTO.and(AccountMetadataTransactionBodyDTO);
const MosaicMetadataTransactionBodyDTO = z
  .object({
    targetAddress: UnresolvedAddress,
    scopedMetadataKey: MetadataKey,
    targetMosaicId: UnresolvedMosaicId,
    valueSizeDelta: z.number().int(),
    valueSize: UInt32.int(),
    value: MetadataValue,
  })
  .passthrough();
const EmbeddedMosaicMetadataTransactionDTO = EmbeddedTransactionDTO.and(MosaicMetadataTransactionBodyDTO);
const NamespaceId = z.string();
const NamespaceMetadataTransactionBodyDTO = z
  .object({
    targetAddress: UnresolvedAddress,
    scopedMetadataKey: MetadataKey,
    targetNamespaceId: NamespaceId.optional(),
    valueSizeDelta: z.number().int(),
    valueSize: UInt32.int(),
    value: MetadataValue,
  })
  .passthrough();
const EmbeddedNamespaceMetadataTransactionDTO = EmbeddedTransactionDTO.and(NamespaceMetadataTransactionBodyDTO);
const MosaicFlagsEnum = z.number();
const MosaicDefinitionTransactionBodyDTO = z
  .object({
    id: MosaicId,
    duration: BlockDuration,
    nonce: UInt32.int(),
    flags: MosaicFlagsEnum.int(),
    divisibility: z.number().int(),
  })
  .passthrough();
const EmbeddedMosaicDefinitionTransactionDTO = EmbeddedTransactionDTO.and(MosaicDefinitionTransactionBodyDTO);
const MosaicSupplyChangeActionEnum = z.union([z.literal(0), z.literal(1)]);
const MosaicSupplyChangeTransactionBodyDTO = z
  .object({
    mosaicId: UnresolvedMosaicId,
    delta: Amount,
    action: MosaicSupplyChangeActionEnum,
  })
  .passthrough();
const EmbeddedMosaicSupplyChangeTransactionDTO = EmbeddedTransactionDTO.and(MosaicSupplyChangeTransactionBodyDTO);
const MosaicSupplyRevocationTransactionBodyDTO = z
  .object({
    sourceAddress: UnresolvedAddress,
    mosaicId: UnresolvedMosaicId,
    amount: Amount,
  })
  .passthrough();
const EmbeddedMosaicSupplyRevocationTransactionDTO = EmbeddedTransactionDTO.and(MosaicSupplyRevocationTransactionBodyDTO);
const NamespaceRegistrationTypeEnum = z.union([z.literal(0), z.literal(1)]);
const NamespaceRegistrationTransactionBodyDTO = z
  .object({
    duration: BlockDuration.optional(),
    parentId: NamespaceId.optional(),
    id: NamespaceId,
    registrationType: NamespaceRegistrationTypeEnum,
    name: z.string(),
  })
  .passthrough();
const EmbeddedNamespaceRegistrationTransactionDTO = EmbeddedTransactionDTO.and(NamespaceRegistrationTransactionBodyDTO);
const AliasActionEnum = z.union([z.literal(0), z.literal(1)]);
const AddressAliasTransactionBodyDTO = z
  .object({
    namespaceId: NamespaceId,
    address: Address,
    aliasAction: AliasActionEnum,
  })
  .passthrough();
const EmbeddedAddressAliasTransactionDTO = EmbeddedTransactionDTO.and(AddressAliasTransactionBodyDTO);
const MosaicAliasTransactionBodyDTO = z
  .object({
    namespaceId: NamespaceId,
    mosaicId: MosaicId,
    aliasAction: AliasActionEnum,
  })
  .passthrough();
const EmbeddedMosaicAliasTransactionDTO = EmbeddedTransactionDTO.and(MosaicAliasTransactionBodyDTO);
const MultisigAccountModificationTransactionBodyDTO = z
  .object({
    minRemovalDelta: z.number().int(),
    minApprovalDelta: z.number().int(),
    addressAdditions: z.array(UnresolvedAddress),
    addressDeletions: z.array(UnresolvedAddress),
  })
  .passthrough();
const EmbeddedMultisigAccountModificationTransactionDTO = EmbeddedTransactionDTO.and(MultisigAccountModificationTransactionBodyDTO);
const AccountRestrictionFlagsEnum = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(16385),
  z.literal(16388),
  z.literal(32769),
  z.literal(32770),
  z.literal(49153),
  z.literal(49156),
]);
const AccountAddressRestrictionTransactionBodyDTO = z
  .object({
    restrictionFlags: AccountRestrictionFlagsEnum,
    restrictionAdditions: z.array(UnresolvedAddress),
    restrictionDeletions: z.array(UnresolvedAddress),
  })
  .passthrough();
const EmbeddedAccountAddressRestrictionTransactionDTO = EmbeddedTransactionDTO.and(AccountAddressRestrictionTransactionBodyDTO);
const AccountMosaicRestrictionTransactionBodyDTO = z
  .object({
    restrictionFlags: AccountRestrictionFlagsEnum,
    restrictionAdditions: z.array(UnresolvedMosaicId),
    restrictionDeletions: z.array(UnresolvedMosaicId),
  })
  .passthrough();
const EmbeddedAccountMosaicRestrictionTransactionDTO = EmbeddedTransactionDTO.and(AccountMosaicRestrictionTransactionBodyDTO);
const AccountOperationRestrictionTransactionBodyDTO = z
  .object({
    restrictionFlags: AccountRestrictionFlagsEnum,
    restrictionAdditions: z.array(TransactionTypeEnum),
    restrictionDeletions: z.array(TransactionTypeEnum),
  })
  .passthrough();
const EmbeddedAccountOperationRestrictionTransactionDTO = EmbeddedTransactionDTO.and(AccountOperationRestrictionTransactionBodyDTO);
const RestrictionKey = z.string();
const RestrictionValue = z.string();
const MosaicRestrictionTypeEnum = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
const MosaicGlobalRestrictionTransactionBodyDTO = z
  .object({
    mosaicId: UnresolvedMosaicId,
    referenceMosaicId: UnresolvedMosaicId,
    restrictionKey: RestrictionKey,
    previousRestrictionValue: RestrictionValue,
    newRestrictionValue: RestrictionValue,
    previousRestrictionType: MosaicRestrictionTypeEnum,
    newRestrictionType: MosaicRestrictionTypeEnum,
  })
  .passthrough();
const EmbeddedMosaicGlobalRestrictionTransactionDTO = EmbeddedTransactionDTO.and(MosaicGlobalRestrictionTransactionBodyDTO);
const MosaicAddressRestrictionTransactionBodyDTO = z
  .object({
    mosaicId: UnresolvedMosaicId,
    restrictionKey: RestrictionKey,
    previousRestrictionValue: RestrictionValue,
    newRestrictionValue: RestrictionValue,
    targetAddress: UnresolvedAddress,
  })
  .passthrough();
const EmbeddedMosaicAddressRestrictionTransactionDTO = EmbeddedTransactionDTO.and(MosaicAddressRestrictionTransactionBodyDTO);
const UnresolvedMosaic = z.object({ id: UnresolvedMosaicId, amount: Amount }).passthrough();
const TransferTransactionBodyDTO = z
  .object({
    recipientAddress: UnresolvedAddress,
    mosaics: z.array(UnresolvedMosaic),
    message: z.string().optional(),
  })
  .passthrough();
const EmbeddedTransferTransactionDTO = EmbeddedTransactionDTO.and(TransferTransactionBodyDTO);
const EmbeddedTransactionInfoDTO = z
  .object({
    id: z.string(),
    meta: EmbeddedTransactionMetaDTO,
    transaction: z.union([
      EmbeddedAccountKeyLinkTransactionDTO,
      EmbeddedNodeKeyLinkTransactionDTO,
      EmbeddedVrfKeyLinkTransactionDTO,
      EmbeddedVotingKeyLinkTransactionDTO,
      EmbeddedHashLockTransactionDTO,
      EmbeddedSecretLockTransactionDTO,
      EmbeddedSecretProofTransactionDTO,
      EmbeddedAccountMetadataTransactionDTO,
      EmbeddedMosaicMetadataTransactionDTO,
      EmbeddedNamespaceMetadataTransactionDTO,
      EmbeddedMosaicDefinitionTransactionDTO,
      EmbeddedMosaicSupplyChangeTransactionDTO,
      EmbeddedMosaicSupplyRevocationTransactionDTO,
      EmbeddedNamespaceRegistrationTransactionDTO,
      EmbeddedAddressAliasTransactionDTO,
      EmbeddedMosaicAliasTransactionDTO,
      EmbeddedMultisigAccountModificationTransactionDTO,
      EmbeddedAccountAddressRestrictionTransactionDTO,
      EmbeddedAccountMosaicRestrictionTransactionDTO,
      EmbeddedAccountOperationRestrictionTransactionDTO,
      EmbeddedMosaicGlobalRestrictionTransactionDTO,
      EmbeddedMosaicAddressRestrictionTransactionDTO,
      EmbeddedTransferTransactionDTO,
    ]),
  })
  .passthrough();
const EmbeddedTransactionBodyDTO = z.object({ transactions: z.array(EmbeddedTransactionInfoDTO) }).passthrough();
const AggregateTransactionBodyExtendedDTO = AggregateTransactionBodyDTO.and(EmbeddedTransactionBodyDTO);
const AggregateTransactionExtendedDTO = TransactionDTO.and(AggregateTransactionBodyExtendedDTO);
const HashLockTransactionDTO = TransactionDTO.and(HashLockTransactionBodyDTO);
const SecretLockTransactionDTO = TransactionDTO.and(SecretLockTransactionBodyDTO);
const SecretProofTransactionDTO = TransactionDTO.and(SecretProofTransactionBodyDTO);
const AccountMetadataTransactionDTO = TransactionDTO.and(AccountMetadataTransactionBodyDTO);
const MosaicMetadataTransactionDTO = TransactionDTO.and(MosaicMetadataTransactionBodyDTO);
const NamespaceMetadataTransactionDTO = TransactionDTO.and(NamespaceMetadataTransactionBodyDTO);
const MosaicDefinitionTransactionDTO = TransactionDTO.and(MosaicDefinitionTransactionBodyDTO);
const MosaicSupplyChangeTransactionDTO = TransactionDTO.and(MosaicSupplyChangeTransactionBodyDTO);
const MosaicSupplyRevocationTransactionDTO = TransactionDTO.and(MosaicSupplyRevocationTransactionBodyDTO);
const NamespaceRegistrationTransactionDTO = TransactionDTO.and(NamespaceRegistrationTransactionBodyDTO);
const AddressAliasTransactionDTO = TransactionDTO.and(AddressAliasTransactionBodyDTO);
const MosaicAliasTransactionDTO = TransactionDTO.and(MosaicAliasTransactionBodyDTO);
const MultisigAccountModificationTransactionDTO = TransactionDTO.and(MultisigAccountModificationTransactionBodyDTO);
const AccountAddressRestrictionTransactionDTO = TransactionDTO.and(AccountAddressRestrictionTransactionBodyDTO);
const AccountMosaicRestrictionTransactionDTO = TransactionDTO.and(AccountMosaicRestrictionTransactionBodyDTO);
const AccountOperationRestrictionTransactionDTO = TransactionDTO.and(AccountOperationRestrictionTransactionBodyDTO);
const MosaicGlobalRestrictionTransactionDTO = TransactionDTO.and(MosaicGlobalRestrictionTransactionBodyDTO);
const MosaicAddressRestrictionTransactionDTO = TransactionDTO.and(MosaicAddressRestrictionTransactionBodyDTO);
const TransferTransactionDTO = TransactionDTO.and(TransferTransactionBodyDTO);
const TransactionInfoDTO = z
  .object({
    id: z.string(),
    meta: z.union([TransactionMetaDTO, EmbeddedTransactionMetaDTO]),
    transaction: z.union([
      AccountKeyLinkTransactionDTO,
      EmbeddedAccountKeyLinkTransactionDTO,
      NodeKeyLinkTransactionDTO,
      EmbeddedNodeKeyLinkTransactionDTO,
      VrfKeyLinkTransactionDTO,
      EmbeddedVrfKeyLinkTransactionDTO,
      VotingKeyLinkTransactionDTO,
      EmbeddedVotingKeyLinkTransactionDTO,
      AggregateTransactionDTO,
      AggregateTransactionExtendedDTO,
      HashLockTransactionDTO,
      EmbeddedHashLockTransactionDTO,
      SecretLockTransactionDTO,
      EmbeddedSecretLockTransactionDTO,
      SecretProofTransactionDTO,
      EmbeddedSecretProofTransactionDTO,
      AccountMetadataTransactionDTO,
      EmbeddedAccountMetadataTransactionDTO,
      MosaicMetadataTransactionDTO,
      EmbeddedMosaicMetadataTransactionDTO,
      NamespaceMetadataTransactionDTO,
      EmbeddedNamespaceMetadataTransactionDTO,
      MosaicDefinitionTransactionDTO,
      EmbeddedMosaicDefinitionTransactionDTO,
      MosaicSupplyChangeTransactionDTO,
      EmbeddedMosaicSupplyChangeTransactionDTO,
      MosaicSupplyRevocationTransactionDTO,
      EmbeddedMosaicSupplyRevocationTransactionDTO,
      NamespaceRegistrationTransactionDTO,
      EmbeddedNamespaceRegistrationTransactionDTO,
      AddressAliasTransactionDTO,
      EmbeddedAddressAliasTransactionDTO,
      MosaicAliasTransactionDTO,
      EmbeddedMosaicAliasTransactionDTO,
      MultisigAccountModificationTransactionDTO,
      EmbeddedMultisigAccountModificationTransactionDTO,
      AccountAddressRestrictionTransactionDTO,
      EmbeddedAccountAddressRestrictionTransactionDTO,
      AccountMosaicRestrictionTransactionDTO,
      EmbeddedAccountMosaicRestrictionTransactionDTO,
      AccountOperationRestrictionTransactionDTO,
      EmbeddedAccountOperationRestrictionTransactionDTO,
      MosaicGlobalRestrictionTransactionDTO,
      EmbeddedMosaicGlobalRestrictionTransactionDTO,
      MosaicAddressRestrictionTransactionDTO,
      EmbeddedMosaicAddressRestrictionTransactionDTO,
      TransferTransactionDTO,
      EmbeddedTransferTransactionDTO,
    ]),
  })
  .passthrough();
const TransactionPage = z.object({ data: z.array(TransactionInfoDTO), pagination: Pagination }).passthrough();
const transactionIds = z
  .object({ transactionIds: z.array(z.string()) })
  .partial()
  .passthrough();
const transactionHashes = z
  .object({ hashes: z.array(Hash256) })
  .partial()
  .passthrough();
const TransactionGroupEnum = z.enum(["unconfirmed", "confirmed", "failed", "partial"]);
const TransactionStatusEnum = z.enum([
  "Success",
  "Neutral",
  "Failure",
  "Failure_Core_Past_Deadline",
  "Failure_Core_Future_Deadline",
  "Failure_Core_Insufficient_Balance",
  "Failure_Core_Too_Many_Transactions",
  "Failure_Core_Nemesis_Account_Signed_After_Nemesis_Block",
  "Failure_Core_Wrong_Network",
  "Failure_Core_Invalid_Address",
  "Failure_Core_Invalid_Version",
  "Failure_Core_Invalid_Transaction_Fee",
  "Failure_Core_Block_Harvester_Ineligible",
  "Failure_Core_Zero_Address",
  "Failure_Core_Zero_Public_Key",
  "Failure_Core_Nonzero_Internal_Padding",
  "Failure_Core_Address_Collision",
  "Failure_Core_Importance_Block_Mismatch",
  "Failure_Core_Unexpected_Block_Type",
  "Failure_Core_Block_Explicit_Transactions_Hash_Mismatch",
  "Failure_Core_Invalid_Link_Action",
  "Failure_Core_Link_Already_Exists",
  "Failure_Core_Inconsistent_Unlink_Data",
  "Failure_Core_Invalid_Link_Range",
  "Failure_Core_Too_Many_Links",
  "Failure_Core_Link_Start_Epoch_Invalid",
  "Failure_Hash_Already_Exists",
  "Failure_Signature_Not_Verifiable",
  "Failure_AccountLink_Link_Already_Exists",
  "Failure_AccountLink_Inconsistent_Unlink_Data",
  "Failure_AccountLink_Unknown_Link",
  "Failure_AccountLink_Remote_Account_Ineligible",
  "Failure_AccountLink_Remote_Account_Signer_Prohibited",
  "Failure_AccountLink_Remote_Account_Participant_Prohibited",
  "Failure_Aggregate_Too_Many_Transactions",
  "Failure_Aggregate_No_Transactions",
  "Failure_Aggregate_Too_Many_Cosignatures",
  "Failure_Aggregate_Redundant_Cosignatures",
  "Failure_Aggregate_Ineligible_Cosignatories",
  "Failure_Aggregate_Missing_Cosignatures",
  "Failure_Aggregate_Transactions_Hash_Mismatch",
  "Failure_LockHash_Invalid_Mosaic_Id",
  "Failure_LockHash_Invalid_Mosaic_Amount",
  "Failure_LockHash_Hash_Already_Exists",
  "Failure_LockHash_Unknown_Hash",
  "Failure_LockHash_Inactive_Hash",
  "Failure_LockHash_Invalid_Duration",
  "Failure_LockSecret_Invalid_Hash_Algorithm",
  "Failure_LockSecret_Hash_Already_Exists",
  "Failure_LockSecret_Proof_Size_Out_Of_Bounds",
  "Failure_LockSecret_Secret_Mismatch",
  "Failure_LockSecret_Unknown_Composite_Key",
  "Failure_LockSecret_Inactive_Secret",
  "Failure_LockSecret_Hash_Algorithm_Mismatch",
  "Failure_LockSecret_Invalid_Duration",
  "Failure_Metadata_Value_Too_Small",
  "Failure_Metadata_Value_Too_Large",
  "Failure_Metadata_Value_Size_Delta_Too_Large",
  "Failure_Metadata_Value_Size_Delta_Mismatch",
  "Failure_Metadata_Value_Change_Irreversible",
  "Failure_Mosaic_Invalid_Duration",
  "Failure_Mosaic_Invalid_Name",
  "Failure_Mosaic_Name_Id_Mismatch",
  "Failure_Mosaic_Expired",
  "Failure_Mosaic_Owner_Conflict",
  "Failure_Mosaic_Id_Mismatch",
  "Failure_Mosaic_Parent_Id_Conflict",
  "Failure_Mosaic_Invalid_Property",
  "Failure_Mosaic_Invalid_Flags",
  "Failure_Mosaic_Invalid_Divisibility",
  "Failure_Mosaic_Invalid_Supply_Change_Action",
  "Failure_Mosaic_Invalid_Supply_Change_Amount",
  "Failure_Mosaic_Invalid_Id",
  "Failure_Mosaic_Modification_Disallowed",
  "Failure_Mosaic_Modification_No_Changes",
  "Failure_Mosaic_Supply_Immutable",
  "Failure_Mosaic_Supply_Negative",
  "Failure_Mosaic_Supply_Exceeded",
  "Failure_Mosaic_Non_Transferable",
  "Failure_Mosaic_Max_Mosaics_Exceeded",
  "Failure_Mosaic_Required_Property_Flag_Unset",
  "Failure_Multisig_Account_In_Both_Sets",
  "Failure_Multisig_Multiple_Deletes",
  "Failure_Multisig_Redundant_Modification",
  "Failure_Multisig_Unknown_Multisig_Account",
  "Failure_Multisig_Not_A_Cosignatory",
  "Failure_Multisig_Already_A_Cosignatory",
  "Failure_Multisig_Min_Setting_Out_Of_Range",
  "Failure_Multisig_Min_Setting_Larger_Than_Num_Cosignatories",
  "Failure_Multisig_Invalid_Modification_Action",
  "Failure_Multisig_Max_Cosigned_Accounts",
  "Failure_Multisig_Max_Cosignatories",
  "Failure_Multisig_Loop",
  "Failure_Multisig_Max_Multisig_Depth",
  "Failure_Multisig_Operation_Prohibited_By_Account",
  "Failure_Namespace_Invalid_Duration",
  "Failure_Namespace_Invalid_Name",
  "Failure_Namespace_Name_Id_Mismatch",
  "Failure_Namespace_Expired",
  "Failure_Namespace_Owner_Conflict",
  "Failure_Namespace_Id_Mismatch",
  "Failure_Namespace_Invalid_Registration_Type",
  "Failure_Namespace_Root_Name_Reserved",
  "Failure_Namespace_Too_Deep",
  "Failure_Namespace_Unknown_Parent",
  "Failure_Namespace_Already_Exists",
  "Failure_Namespace_Already_Active",
  "Failure_Namespace_Eternal_After_Nemesis_Block",
  "Failure_Namespace_Max_Children_Exceeded",
  "Failure_Namespace_Alias_Invalid_Action",
  "Failure_Namespace_Unknown",
  "Failure_Namespace_Alias_Already_Exists",
  "Failure_Namespace_Unknown_Alias",
  "Failure_Namespace_Alias_Inconsistent_Unlink_Type",
  "Failure_Namespace_Alias_Inconsistent_Unlink_Data",
  "Failure_Namespace_Alias_Invalid_Address",
  "Failure_RestrictionAccount_Invalid_Restriction_Flags",
  "Failure_RestrictionAccount_Invalid_Modification_Action",
  "Failure_RestrictionAccount_Invalid_Modification_Address",
  "Failure_RestrictionAccount_Modification_Operation_Type_Incompatible",
  "Failure_RestrictionAccount_Redundant_Modification",
  "Failure_RestrictionAccount_Invalid_Modification",
  "Failure_RestrictionAccount_Modification_Count_Exceeded",
  "Failure_RestrictionAccount_No_Modifications",
  "Failure_RestrictionAccount_Values_Count_Exceeded",
  "Failure_RestrictionAccount_Invalid_Value",
  "Failure_RestrictionAccount_Address_Interaction_Prohibited",
  "Failure_RestrictionAccount_Mosaic_Transfer_Prohibited",
  "Failure_RestrictionAccount_Operation_Type_Prohibited",
  "Failure_RestrictionMosaic_Invalid_Restriction_Type",
  "Failure_RestrictionMosaic_Previous_Value_Mismatch",
  "Failure_RestrictionMosaic_Previous_Value_Must_Be_Zero",
  "Failure_RestrictionMosaic_Max_Restrictions_Exceeded",
  "Failure_RestrictionMosaic_Cannot_Delete_Nonexistent_Restriction",
  "Failure_RestrictionMosaic_Unknown_Global_Restriction",
  "Failure_RestrictionMosaic_Invalid_Global_Restriction",
  "Failure_RestrictionMosaic_Account_Unauthorized",
  "Failure_Transfer_Message_Too_Large",
  "Failure_Transfer_Out_Of_Order_Mosaics",
  "Failure_Chain_Unlinked",
  "Failure_Chain_Block_Not_Hit",
  "Failure_Chain_Block_Inconsistent_State_Hash",
  "Failure_Chain_Block_Inconsistent_Receipts_Hash",
  "Failure_Chain_Block_Invalid_Vrf_Proof",
  "Failure_Chain_Block_Unknown_Signer",
  "Failure_Chain_Unconfirmed_Cache_Too_Full",
  "Failure_Consumer_Empty_Input",
  "Failure_Consumer_Block_Transactions_Hash_Mismatch",
  "Neutral_Consumer_Hash_In_Recency_Cache",
  "Failure_Consumer_Remote_Chain_Too_Many_Blocks",
  "Failure_Consumer_Remote_Chain_Improper_Link",
  "Failure_Consumer_Remote_Chain_Duplicate_Transactions",
  "Failure_Consumer_Remote_Chain_Unlinked",
  "Failure_Consumer_Remote_Chain_Difficulties_Mismatch",
  "Failure_Consumer_Remote_Chain_Score_Not_Better",
  "Failure_Consumer_Remote_Chain_Too_Far_Behind",
  "Failure_Consumer_Remote_Chain_Too_Far_In_Future",
  "Failure_Consumer_Batch_Signature_Not_Verifiable",
  "Failure_Consumer_Remote_Chain_Improper_Importance_Link",
  "Failure_Extension_Partial_Transaction_Cache_Prune",
  "Failure_Extension_Partial_Transaction_Dependency_Removed",
  "Failure_Extension_Read_Rate_Limit_Exceeded",
]);
const TransactionStatusDTO = z
  .object({
    group: TransactionGroupEnum,
    code: TransactionStatusEnum.optional(),
    hash: Hash256,
    deadline: BlockDuration,
    height: Height.optional(),
  })
  .passthrough();
const cosignature = z
  .object({
    parentHash: Hash256,
    signature: Signature,
    signerPublicKey: PublicKey,
    version: CosignatureVersion,
  })
  .partial()
  .passthrough();
const LockStatus = z.union([z.literal(0), z.literal(1)]);
const HashLockEntryDTO = z
  .object({
    version: StateVersion.int(),
    ownerAddress: Address,
    mosaicId: MosaicId,
    amount: Amount,
    endHeight: Height,
    status: LockStatus,
    hash: Hash256,
  })
  .passthrough();
const HashLockInfoDTO = z.object({ id: z.string(), lock: HashLockEntryDTO }).passthrough();
const HashLockPage = z.object({ data: z.array(HashLockInfoDTO), pagination: Pagination }).passthrough();
const Secret = z.string();
const SecretLockEntryDTO = z
  .object({
    version: StateVersion.int(),
    ownerAddress: Address,
    mosaicId: MosaicId,
    amount: Amount,
    endHeight: Height,
    status: LockStatus,
    hashAlgorithm: LockHashAlgorithmEnum_,
    secret: Secret,
    recipientAddress: Address,
    compositeHash: Hash256,
  })
  .passthrough();
const SecretLockInfoDTO = z.object({ id: z.string(), lock: SecretLockEntryDTO }).passthrough();
const SecretLockPage = z.object({ data: z.array(SecretLockInfoDTO), pagination: Pagination }).passthrough();
const MetadataTypeEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const MetadataEntryDTO = z
  .object({
    version: StateVersion.int(),
    compositeHash: Hash256,
    sourceAddress: Address,
    targetAddress: Address,
    scopedMetadataKey: MetadataKey,
    targetId: z.union([MosaicId, NamespaceId]).optional(),
    metadataType: MetadataTypeEnum,
    value: z.string(),
  })
  .passthrough();
const MetadataInfoDTO = z.object({ id: z.string(), metadataEntry: MetadataEntryDTO }).passthrough();
const MetadataPage = z.object({ data: z.array(MetadataInfoDTO), pagination: Pagination }).passthrough();
const MosaicDTO = z
  .object({
    version: StateVersion.int(),
    id: MosaicId,
    supply: Amount,
    startHeight: Height,
    ownerAddress: Address,
    revision: UInt32.int(),
    flags: MosaicFlagsEnum.int(),
    divisibility: z.number().int(),
    duration: BlockDuration,
  })
  .passthrough();
const MosaicInfoDTO = z.object({ id: z.string(), mosaic: MosaicDTO }).passthrough();
const MosaicPage = z.object({ data: z.array(MosaicInfoDTO), pagination: Pagination }).passthrough();
const mosaicIds = z
  .object({ mosaicIds: z.array(MosaicId) })
  .partial()
  .passthrough();
const MultisigDTO = z
  .object({
    version: StateVersion.int(),
    accountAddress: Address,
    minApproval: UInt32.int(),
    minRemoval: UInt32.int(),
    cosignatoryAddresses: z.array(Address),
    multisigAddresses: z.array(Address),
  })
  .passthrough();
const MultisigAccountInfoDTO = z.object({ multisig: MultisigDTO }).passthrough();
const MultisigAccountGraphInfoDTO = z
  .object({
    level: z.number().int(),
    multisigEntries: z.array(MultisigAccountInfoDTO),
  })
  .passthrough();
const NamespaceMetaDTO = z.object({ active: z.boolean(), index: z.number().int() }).passthrough();
const AliasTypeEnum = z.union([z.literal(0), z.literal(1), z.literal(2)]);
const AliasDTO = z
  .object({
    type: AliasTypeEnum,
    mosaicId: MosaicId.optional(),
    address: Address.optional(),
  })
  .passthrough();
const NamespaceDTO = z
  .object({
    version: StateVersion.int(),
    registrationType: NamespaceRegistrationTypeEnum,
    depth: z.number().int(),
    level0: NamespaceId,
    level1: NamespaceId.optional(),
    level2: NamespaceId.optional(),
    alias: AliasDTO,
    parentId: NamespaceId,
    ownerAddress: Address,
    startHeight: Height,
    endHeight: Height,
  })
  .passthrough();
const NamespaceInfoDTO = z.object({ id: z.string(), meta: NamespaceMetaDTO, namespace: NamespaceDTO }).passthrough();
const NamespacePage = z.object({ data: z.array(NamespaceInfoDTO), pagination: Pagination }).passthrough();
const namespaceIds = z
  .object({ namespaceIds: z.array(NamespaceId) })
  .partial()
  .passthrough();
const NamespaceNameDTO = z
  .object({
    parentId: NamespaceId.optional(),
    id: NamespaceId,
    name: z.string(),
  })
  .passthrough();
const addresses = z
  .object({ addresses: z.array(Address) })
  .partial()
  .passthrough();
const AccountNamesDTO = z.object({ address: Address, names: z.array(z.string()) }).passthrough();
const AccountsNamesDTO = z.object({ accountNames: z.array(AccountNamesDTO) }).passthrough();
const MosaicNamesDTO = z.object({ mosaicId: MosaicId, names: z.array(z.string()) }).passthrough();
const MosaicsNamesDTO = z.object({ mosaicNames: z.array(MosaicNamesDTO) }).passthrough();
const ReceiptTypeEnum = z.union([
  z.literal(4685),
  z.literal(4942),
  z.literal(8515),
  z.literal(8776),
  z.literal(9032),
  z.literal(8786),
  z.literal(9042),
  z.literal(12616),
  z.literal(12626),
  z.literal(16717),
  z.literal(16718),
  z.literal(16974),
  z.literal(20803),
  z.literal(57667),
  z.literal(61763),
  z.literal(62019),
]);
const StatementMetaDTO = z.object({ timestamp: Timestamp }).passthrough();
const SourceDTO = z.object({ primaryId: UInt32.int(), secondaryId: UInt32.int() }).passthrough();
const ReceiptDTO = z.object({ version: z.number().int(), type: ReceiptTypeEnum }).passthrough();
const BalanceTransferReceiptDTO = ReceiptDTO.and(
  z
    .object({
      mosaicId: MosaicId,
      amount: Amount,
      senderAddress: Address,
      recipientAddress: Address,
    })
    .passthrough(),
);
const BalanceChangeReceiptDTO = ReceiptDTO.and(z.object({ mosaicId: MosaicId, amount: Amount, targetAddress: Address }).passthrough());
const NamespaceExpiryReceiptDTO = ReceiptDTO.and(z.object({ artifactId: NamespaceId }).passthrough());
const MosaicExpiryReceiptDTO = ReceiptDTO.and(z.object({ artifactId: MosaicId }).passthrough());
const InflationReceiptDTO = ReceiptDTO.and(z.object({ mosaicId: MosaicId, amount: Amount }).passthrough());
const TransactionStatementDTO = z
  .object({
    height: Height,
    source: SourceDTO,
    receipts: z.array(
      z.union([BalanceTransferReceiptDTO, BalanceChangeReceiptDTO, NamespaceExpiryReceiptDTO, MosaicExpiryReceiptDTO, InflationReceiptDTO]),
    ),
  })
  .passthrough();
const TransactionStatementInfoDTO = z
  .object({
    id: z.string(),
    meta: StatementMetaDTO,
    statement: TransactionStatementDTO,
  })
  .passthrough();
const TransactionStatementPage = z
  .object({
    data: z.array(TransactionStatementInfoDTO),
    pagination: Pagination,
  })
  .passthrough();
const ResolutionEntryDTO = z.object({ source: SourceDTO, resolved: z.union([Address, MosaicId]) }).passthrough();
const ResolutionStatementDTO = z
  .object({
    height: Height,
    unresolved: z.union([UnresolvedMosaicId, UnresolvedAddress]),
    resolutionEntries: z.array(ResolutionEntryDTO),
  })
  .passthrough();
const ResolutionStatementInfoDTO = z
  .object({
    id: z.string(),
    meta: StatementMetaDTO,
    statement: ResolutionStatementDTO,
  })
  .passthrough();
const ResolutionStatementPage = z.object({ data: z.array(ResolutionStatementInfoDTO), pagination: Pagination }).passthrough();
const AccountRestrictionDTO = z
  .object({
    restrictionFlags: AccountRestrictionFlagsEnum,
    values: z.array(z.union([UnresolvedAddress, UnresolvedMosaicId, TransactionTypeEnum])),
  })
  .passthrough();
const AccountRestrictionsDTO = z
  .object({
    version: StateVersion.int(),
    address: Address,
    restrictions: z.array(AccountRestrictionDTO),
  })
  .passthrough();
const AccountRestrictionsInfoDTO = z.object({ accountRestrictions: AccountRestrictionsDTO }).passthrough();
const AccountRestrictionsPage = z.object({ data: z.array(AccountRestrictionsInfoDTO), pagination: Pagination }).passthrough();
const MosaicRestrictionEntryTypeEnum = z.union([z.literal(0), z.literal(1)]);
const MosaicAddressRestrictionEntryDTO = z.object({ key: RestrictionKey, value: z.string() }).passthrough();
const MosaicAddressRestrictionEntryWrapperDTO = z
  .object({
    version: StateVersion.int(),
    compositeHash: Hash256,
    entryType: MosaicRestrictionEntryTypeEnum,
    mosaicId: MosaicId,
    targetAddress: Address,
    restrictions: z.array(MosaicAddressRestrictionEntryDTO),
  })
  .passthrough();
const MosaicAddressRestrictionDTO = z
  .object({
    id: z.string(),
    mosaicRestrictionEntry: MosaicAddressRestrictionEntryWrapperDTO,
  })
  .passthrough();
const MosaicGlobalRestrictionEntryRestrictionDTO = z
  .object({
    referenceMosaicId: MosaicId,
    restrictionValue: RestrictionValue,
    restrictionType: MosaicRestrictionTypeEnum,
  })
  .passthrough();
const MosaicGlobalRestrictionEntryDTO = z
  .object({
    key: RestrictionKey,
    restriction: MosaicGlobalRestrictionEntryRestrictionDTO,
  })
  .passthrough();
const MosaicGlobalRestrictionEntryWrapperDTO = z
  .object({
    version: StateVersion.int(),
    compositeHash: Hash256,
    entryType: MosaicRestrictionEntryTypeEnum,
    mosaicId: MosaicId,
    restrictions: z.array(MosaicGlobalRestrictionEntryDTO),
  })
  .passthrough();
const MosaicGlobalRestrictionDTO = z
  .object({
    id: z.string(),
    mosaicRestrictionEntry: MosaicGlobalRestrictionEntryWrapperDTO,
  })
  .passthrough();
const MosaicRestrictionsPage = z
  .object({
    data: z.array(z.union([MosaicAddressRestrictionDTO, MosaicGlobalRestrictionDTO])),
    pagination: Pagination,
  })
  .passthrough();
const MosaicRestrictionDTO = z.union([MosaicAddressRestrictionDTO, MosaicGlobalRestrictionDTO]);

export const schemas = {
  StateVersion,
  Address,
  Height,
  PublicKey,
  AccountTypeEnum,
  AccountLinkPublicKeyDTO,
  FinalizationEpoch,
  AccountLinkVotingKeyDTO,
  AccountLinkVotingKeysDTO,
  SupplementalPublicKeysDTO,
  Amount,
  UInt32,
  Importance,
  ActivityBucketDTO,
  MosaicId,
  Mosaic,
  AccountDTO,
  AccountInfoDTO,
  Pagination,
  AccountPage,
  ModelError,
  accountIds,
  MerkleTreeRaw,
  MerkleTreeNodeTypeEnum,
  Hash256,
  MerkleTreeBranchLinkDTO,
  MerkleTreeBranchDTO,
  MerkleTreeLeafDTO,
  MerkleStateInfoDTO,
  BlockMetaDTO,
  SizePrefixedEntityDTO,
  Signature,
  VerifiableEntityDTO,
  NetworkTypeEnum,
  EntityDTO,
  Timestamp,
  Difficulty,
  ProofGamma,
  ProofVerificationHash,
  ProofScalar,
  BlockFeeMultiplier,
  BlockDTO,
  UInt64,
  ImportanceBlockDTO,
  BlockInfoDTO,
  BlockPage,
  PositionEnum,
  MerklePathItemDTO,
  MerkleProofInfoDTO,
  Score,
  FinalizationPoint,
  FinalizedBlockDTO,
  ChainInfoDTO,
  StageEnum,
  ParentPublicKeySignaturePair,
  BmTreeSignature,
  MessageGroup,
  FinalizationProofDTO,
  NetworkTypeDTO,
  RentalFeesDTO,
  TransactionFeesDTO,
  NodeIdentityEqualityStrategy,
  NetworkPropertiesDTO,
  ChainPropertiesDTO,
  AccountKeyLinkNetworkPropertiesDTO,
  AggregateNetworkPropertiesDTO,
  HashLockNetworkPropertiesDTO,
  SecretLockNetworkPropertiesDTO,
  MetadataNetworkPropertiesDTO,
  MosaicNetworkPropertiesDTO,
  MultisigNetworkPropertiesDTO,
  NamespaceNetworkPropertiesDTO,
  AccountRestrictionNetworkPropertiesDTO,
  MosaicRestrictionNetworkPropertiesDTO,
  TransferNetworkPropertiesDTO,
  PluginsPropertiesDTO,
  NetworkConfigurationDTO,
  NodeStatusEnum,
  NodeHealthDTO,
  NodeHealthInfoDTO,
  RolesTypeEnum,
  NodeInfoDTO,
  StorageInfoDTO,
  CommunicationTimestampsDTO,
  NodeTimeDTO,
  DeploymentDTO,
  ServerDTO,
  ServerInfoDTO,
  UnlockedAccountDTO,
  transactionPayload,
  AnnounceTransactionInfoDTO,
  TransactionTypeEnum,
  TransactionMetaDTO,
  EmbeddedTransactionMetaDTO,
  BlockDuration,
  TransactionBodyDTO,
  TransactionDTO,
  LinkActionEnum,
  AccountKeyLinkTransactionBodyDTO,
  AccountKeyLinkTransactionDTO,
  EmbeddedTransactionDTO,
  EmbeddedAccountKeyLinkTransactionDTO,
  NodeKeyLinkTransactionBodyDTO,
  NodeKeyLinkTransactionDTO,
  EmbeddedNodeKeyLinkTransactionDTO,
  VrfKeyLinkTransactionBodyDTO,
  VrfKeyLinkTransactionDTO,
  EmbeddedVrfKeyLinkTransactionDTO,
  VotingKey,
  VotingKeyLinkTransactionBodyDTO,
  VotingKeyLinkTransactionDTO,
  EmbeddedVotingKeyLinkTransactionDTO,
  CosignatureVersion,
  CosignatureDTO,
  AggregateTransactionBodyDTO,
  AggregateTransactionDTO,
  UnresolvedMosaicId,
  HashLockTransactionBodyDTO,
  EmbeddedHashLockTransactionDTO,
  UnresolvedAddress,
  LockHashAlgorithmEnum_,
  SecretLockTransactionBodyDTO,
  EmbeddedSecretLockTransactionDTO,
  SecretProofTransactionBodyDTO,
  EmbeddedSecretProofTransactionDTO,
  MetadataKey,
  MetadataValue,
  AccountMetadataTransactionBodyDTO,
  EmbeddedAccountMetadataTransactionDTO,
  MosaicMetadataTransactionBodyDTO,
  EmbeddedMosaicMetadataTransactionDTO,
  NamespaceId,
  NamespaceMetadataTransactionBodyDTO,
  EmbeddedNamespaceMetadataTransactionDTO,
  MosaicFlagsEnum,
  MosaicDefinitionTransactionBodyDTO,
  EmbeddedMosaicDefinitionTransactionDTO,
  MosaicSupplyChangeActionEnum,
  MosaicSupplyChangeTransactionBodyDTO,
  EmbeddedMosaicSupplyChangeTransactionDTO,
  MosaicSupplyRevocationTransactionBodyDTO,
  EmbeddedMosaicSupplyRevocationTransactionDTO,
  NamespaceRegistrationTypeEnum,
  NamespaceRegistrationTransactionBodyDTO,
  EmbeddedNamespaceRegistrationTransactionDTO,
  AliasActionEnum,
  AddressAliasTransactionBodyDTO,
  EmbeddedAddressAliasTransactionDTO,
  MosaicAliasTransactionBodyDTO,
  EmbeddedMosaicAliasTransactionDTO,
  MultisigAccountModificationTransactionBodyDTO,
  EmbeddedMultisigAccountModificationTransactionDTO,
  AccountRestrictionFlagsEnum,
  AccountAddressRestrictionTransactionBodyDTO,
  EmbeddedAccountAddressRestrictionTransactionDTO,
  AccountMosaicRestrictionTransactionBodyDTO,
  EmbeddedAccountMosaicRestrictionTransactionDTO,
  AccountOperationRestrictionTransactionBodyDTO,
  EmbeddedAccountOperationRestrictionTransactionDTO,
  RestrictionKey,
  RestrictionValue,
  MosaicRestrictionTypeEnum,
  MosaicGlobalRestrictionTransactionBodyDTO,
  EmbeddedMosaicGlobalRestrictionTransactionDTO,
  MosaicAddressRestrictionTransactionBodyDTO,
  EmbeddedMosaicAddressRestrictionTransactionDTO,
  UnresolvedMosaic,
  TransferTransactionBodyDTO,
  EmbeddedTransferTransactionDTO,
  EmbeddedTransactionInfoDTO,
  EmbeddedTransactionBodyDTO,
  AggregateTransactionBodyExtendedDTO,
  AggregateTransactionExtendedDTO,
  HashLockTransactionDTO,
  SecretLockTransactionDTO,
  SecretProofTransactionDTO,
  AccountMetadataTransactionDTO,
  MosaicMetadataTransactionDTO,
  NamespaceMetadataTransactionDTO,
  MosaicDefinitionTransactionDTO,
  MosaicSupplyChangeTransactionDTO,
  MosaicSupplyRevocationTransactionDTO,
  NamespaceRegistrationTransactionDTO,
  AddressAliasTransactionDTO,
  MosaicAliasTransactionDTO,
  MultisigAccountModificationTransactionDTO,
  AccountAddressRestrictionTransactionDTO,
  AccountMosaicRestrictionTransactionDTO,
  AccountOperationRestrictionTransactionDTO,
  MosaicGlobalRestrictionTransactionDTO,
  MosaicAddressRestrictionTransactionDTO,
  TransferTransactionDTO,
  TransactionInfoDTO,
  TransactionPage,
  transactionIds,
  transactionHashes,
  TransactionGroupEnum,
  TransactionStatusEnum,
  TransactionStatusDTO,
  cosignature,
  LockStatus,
  HashLockEntryDTO,
  HashLockInfoDTO,
  HashLockPage,
  Secret,
  SecretLockEntryDTO,
  SecretLockInfoDTO,
  SecretLockPage,
  MetadataTypeEnum,
  MetadataEntryDTO,
  MetadataInfoDTO,
  MetadataPage,
  MosaicDTO,
  MosaicInfoDTO,
  MosaicPage,
  mosaicIds,
  MultisigDTO,
  MultisigAccountInfoDTO,
  MultisigAccountGraphInfoDTO,
  NamespaceMetaDTO,
  AliasTypeEnum,
  AliasDTO,
  NamespaceDTO,
  NamespaceInfoDTO,
  NamespacePage,
  namespaceIds,
  NamespaceNameDTO,
  addresses,
  AccountNamesDTO,
  AccountsNamesDTO,
  MosaicNamesDTO,
  MosaicsNamesDTO,
  ReceiptTypeEnum,
  StatementMetaDTO,
  SourceDTO,
  ReceiptDTO,
  BalanceTransferReceiptDTO,
  BalanceChangeReceiptDTO,
  NamespaceExpiryReceiptDTO,
  MosaicExpiryReceiptDTO,
  InflationReceiptDTO,
  TransactionStatementDTO,
  TransactionStatementInfoDTO,
  TransactionStatementPage,
  ResolutionEntryDTO,
  ResolutionStatementDTO,
  ResolutionStatementInfoDTO,
  ResolutionStatementPage,
  AccountRestrictionDTO,
  AccountRestrictionsDTO,
  AccountRestrictionsInfoDTO,
  AccountRestrictionsPage,
  MosaicRestrictionEntryTypeEnum,
  MosaicAddressRestrictionEntryDTO,
  MosaicAddressRestrictionEntryWrapperDTO,
  MosaicAddressRestrictionDTO,
  MosaicGlobalRestrictionEntryRestrictionDTO,
  MosaicGlobalRestrictionEntryDTO,
  MosaicGlobalRestrictionEntryWrapperDTO,
  MosaicGlobalRestrictionDTO,
  MosaicRestrictionsPage,
  MosaicRestrictionDTO,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/account/:address/multisig",
    alias: "getAccountMultisig",
    description: "Returns the multisig account information.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MultisigAccountInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/account/:address/multisig/graph",
    alias: "getAccountMultisigGraph",
    description: "Returns the multisig account graph.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(MultisigAccountGraphInfoDTO),
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/account/:address/multisig/merkle",
    alias: "getAccountMultisigMerkle",
    description: "Returns the multisig account merkle information.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/accounts",
    alias: "searchAccounts",
    description: "Gets an array of accounts.",
    requestFormat: "json",
    parameters: [
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "orderBy",
        type: "Query",
        schema: z.enum(["id", "balance"]).optional(),
      },
      {
        name: "mosaicId",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: AccountPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/accounts",
    alias: "getAccountsInfo",
    description: "Returns the account information for an array of accounts.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: accountIds.optional(),
      },
    ],
    response: z.array(AccountInfoDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/accounts/:accountId",
    alias: "getAccountInfo",
    description: "Returns the account information.",
    requestFormat: "json",
    parameters: [
      {
        name: "accountId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: AccountInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/accounts/:accountId/merkle",
    alias: "getAccountInfoMerkle",
    description: "Returns the account merkle information.",
    requestFormat: "json",
    parameters: [
      {
        name: "accountId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/blocks",
    alias: "searchBlocks",
    description: "Gets an array of bocks.",
    requestFormat: "json",
    parameters: [
      {
        name: "signerPublicKey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "beneficiaryAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
      {
        name: "orderBy",
        type: "Query",
        schema: z.enum(["id", "height"]).optional(),
      },
    ],
    response: BlockPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/blocks/:height",
    alias: "getBlockByHeight",
    description: "Gets a block from the chain that has the given height.",
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: BlockInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/blocks/:height/statements/:hash/merkle",
    alias: "getMerkleReceipts",
    description: `Returns the merkle path for a receipt statement or resolution linked to a block.
The merkle path is the minimum number of nodes needed to calculate the merkle root.

Steps to calculate the merkle root:
1. proofHash &#x3D; hash (leaf).
2. Concatenate proofHash with the first unprocessed item from the merklePath list as follows:
* a) If item.position &#x3D;&#x3D; left -&gt; proofHash &#x3D; sha_256(item.hash + proofHash).
* b) If item.position &#x3D;&#x3D; right -&gt; proofHash &#x3D; sha_256(proofHash+ item.hash).
3. Repeat 2. for every item in the merklePath list.
4. Compare if the calculated proofHash equals the one recorded in the
block header (block.receiptsHash) to verify if the statement was linked with the block.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "hash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleProofInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/blocks/:height/transactions/:hash/merkle",
    alias: "getMerkleTransaction",
    description: `Returns the merkle path for a transaction included in a block.
The merkle path is the minimum number of nodes needed to calculate the merkle root.

Steps to calculate the merkle root:
1. proofHash &#x3D; hash (leaf).
2. Concatenate proofHash with the first unprocessed item from the merklePath list as follows:
* a) If item.position &#x3D;&#x3D; left -&gt; proofHash &#x3D; sha_256(item.hash + proofHash).
* b) If item.position &#x3D;&#x3D; right -&gt; proofHash &#x3D; sha_256(proofHash+ item.hash).
3. Repeat 2. for every item in the merklePath list.
4. Compare if the calculated proofHash equals the one recorded in the
block header (block.transactionsHash) to verify if the transaction was included in the block.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "hash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleProofInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/chain/info",
    alias: "getChainInfo",
    description: `Returns the current information of the blockchain.

The higher the score, the better the chain.
During synchronization, nodes try to get the best blockchain in the network.

The score for a block is derived from its difficulty and the time (in seconds) that has elapsed since the last block:

    block score &#x3D; difficulty − time elapsed since last block
`,
    requestFormat: "json",
    response: ChainInfoDTO,
  },
  {
    method: "get",
    path: "/finalization/proof/epoch/:epoch",
    alias: "getFinalizationProofAtEpoch",
    description: "Gets finalization proof for the greatest height associated with the given epoch.",
    requestFormat: "json",
    parameters: [
      {
        name: "epoch",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: FinalizationProofDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/finalization/proof/height/:height",
    alias: "getFinalizationProofAtHeight",
    description: "Gets finalization proof at the given height.",
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: FinalizationProofDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/hash",
    alias: "searchHashLock",
    description: "Returns an array of hash locks.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: HashLockPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/hash/:hash",
    alias: "getHashLock",
    description: "Gets the hash lock for a given hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "hash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: HashLockInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/hash/:hash/merkle",
    alias: "getHashLockMerkle",
    description: "Gets the hash lock merkle for a given hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "hash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/secret",
    alias: "searchSecretLock",
    description: "Returns an array of secret locks.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "secret",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: SecretLockPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/secret/:compositeHash",
    alias: "getSecretLock",
    description: "Gets the hash lock for a given composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: SecretLockInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/lock/secret/:compositeHash/merkle",
    alias: "getSecretLockMerkle",
    description: "Gets the hash lock merkle for a given composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/metadata",
    alias: "searchMetadataEntries",
    description: "Returns an array of metadata.",
    requestFormat: "json",
    parameters: [
      {
        name: "sourceAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "targetAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "scopedMetadataKey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "targetId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "metadataType",
        type: "Query",
        schema: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: MetadataPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/metadata/:compositeHash",
    alias: "getMetadata",
    description: "Gets the metadata for a given composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MetadataInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/metadata/:compositeHash/merkle",
    alias: "getMetadataMerkle",
    description: "Gets the metadata merkle for a given composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/mosaics",
    alias: "searchMosaics",
    description: "Gets an array of mosaics.",
    requestFormat: "json",
    parameters: [
      {
        name: "ownerAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: MosaicPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/mosaics",
    alias: "getMosaics",
    description: "Gets an array of mosaic definition.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: mosaicIds,
      },
    ],
    response: z.array(MosaicInfoDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/mosaics/:mosaicId",
    alias: "getMosaic",
    description: "Gets the mosaic definition for a given mosaic identifier.",
    requestFormat: "json",
    parameters: [
      {
        name: "mosaicId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MosaicInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/mosaics/:mosaicId/merkle",
    alias: "getMosaicMerkle",
    description: "Gets the mosaic definition merkle for a given mosaic identifier.",
    requestFormat: "json",
    parameters: [
      {
        name: "mosaicId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/namespaces",
    alias: "searchNamespaces",
    description: "Gets an array of namespaces.",
    requestFormat: "json",
    parameters: [
      {
        name: "ownerAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "registrationType",
        type: "Query",
        schema: z.union([z.literal(0), z.literal(1)]).optional(),
      },
      {
        name: "level0",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "aliasType",
        type: "Query",
        schema: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: NamespacePage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/namespaces/:namespaceId",
    alias: "getNamespace",
    description: "Gets the namespace for a given namespace identifier.",
    requestFormat: "json",
    parameters: [
      {
        name: "namespaceId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: NamespaceInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/namespaces/:namespaceId/merkle",
    alias: "getNamespaceMerkle",
    description: "Gets the namespace merkle for a given namespace identifier.",
    requestFormat: "json",
    parameters: [
      {
        name: "namespaceId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/namespaces/account/names",
    alias: "getAccountsNames",
    description: "Returns friendly names for accounts.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: addresses,
      },
    ],
    response: AccountsNamesDTO,
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/namespaces/mosaic/names",
    alias: "getMosaicsNames",
    description: "Returns friendly names for mosaics.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: mosaicIds,
      },
    ],
    response: MosaicsNamesDTO,
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/namespaces/names",
    alias: "getNamespacesNames",
    description: "Returns friendly names for namespaces.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: namespaceIds,
      },
    ],
    response: z.array(NamespaceNameDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/network",
    alias: "getNetworkType",
    description: "Returns the current network type.",
    requestFormat: "json",
    response: NetworkTypeDTO,
  },
  {
    method: "get",
    path: "/network/fees/rental",
    alias: "getRentalFees",
    description: `Returns the estimated effective rental fees for namespaces and mosaics.
This endpoint is only available if the REST instance has access to catapult-server &#x60;&#x60;resources/config-network.properties&#x60;&#x60; file.
To activate this feature, add the setting &quot;network.propertiesFilePath&quot; in the configuration file (rest/resources/rest.json).
`,
    requestFormat: "json",
    response: RentalFeesDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/network/fees/transaction",
    alias: "getTransactionFees",
    description: `Returns the average, median, highest and lower fee multiplier over the last &quot;numBlocksTransactionFeeStats&quot;.
The setting &quot;numBlocksTransactionFeeStats&quot; is adjustable via the configuration file (rest/resources/rest.json) per REST instance.
`,
    requestFormat: "json",
    response: TransactionFeesDTO,
  },
  {
    method: "get",
    path: "/network/properties",
    alias: "getNetworkProperties",
    description: `Returns the content from a catapult-server network configuration file (resources/config-network.properties).
To enable this feature, the REST setting &quot;network.propertiesFilePath&quot; must define where the file is located.
This is adjustable via the configuration file (rest/resources/rest.json) per REST instance.
`,
    requestFormat: "json",
    response: NetworkConfigurationDTO,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/node/health",
    alias: "getNodeHealth",
    description: "Supplies information regarding the connection and services status.",
    requestFormat: "json",
    response: NodeHealthInfoDTO,
    errors: [
      {
        status: 503,
        description: "Either API node or database service is unavailable or unreachable from REST server.",
        schema: NodeHealthInfoDTO,
      },
    ],
  },
  {
    method: "get",
    path: "/node/info",
    alias: "getNodeInfo",
    description: "Supplies additional information about the application running on a node.",
    requestFormat: "json",
    response: NodeInfoDTO,
  },
  {
    method: "get",
    path: "/node/peers",
    alias: "getNodePeers",
    description: "Gets the list of peers visible by the node.",
    requestFormat: "json",
    response: z.array(NodeInfoDTO),
  },
  {
    method: "get",
    path: "/node/server",
    alias: "getServerInfo",
    description: "Returns the version of the running catapult-rest component.",
    requestFormat: "json",
    response: ServerInfoDTO,
  },
  {
    method: "get",
    path: "/node/storage",
    alias: "getNodeStorage",
    description: "Returns storage information about the node.",
    requestFormat: "json",
    response: StorageInfoDTO,
  },
  {
    method: "get",
    path: "/node/time",
    alias: "getNodeTime",
    description: "Gets the node time at the moment the reply was sent and received.",
    requestFormat: "json",
    response: NodeTimeDTO,
  },
  {
    method: "get",
    path: "/node/unlockedaccount",
    alias: "getUnlockedAccount",
    description: "Returns array of unlocked account public keys.",
    requestFormat: "json",
    response: UnlockedAccountDTO,
  },
  {
    method: "get",
    path: "/restrictions/account",
    alias: "searchAccountRestrictions",
    description: "Returns an array of account restrictions.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: AccountRestrictionsPage,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/restrictions/account/:address",
    alias: "getAccountRestrictions",
    description: "Returns the account restrictions for a given address.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: AccountRestrictionsInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/restrictions/account/:address/merkle",
    alias: "getAccountRestrictionsMerkle",
    description: "Returns the account restrictions merkle for a given address.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/restrictions/mosaic",
    alias: "searchMosaicRestrictions",
    description: "Returns an array of mosaic restrictions.",
    requestFormat: "json",
    parameters: [
      {
        name: "mosaicId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "entryType",
        type: "Query",
        schema: z.union([z.literal(0), z.literal(1)]).optional(),
      },
      {
        name: "targetAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: MosaicRestrictionsPage,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/restrictions/mosaic/:compositeHash",
    alias: "getMosaicRestrictions",
    description: "Returns the mosaic restrictions for a composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MosaicRestrictionDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/restrictions/mosaic/:compositeHash/merkle",
    alias: "getMosaicRestrictionsMerkle",
    description: "Returns the mosaic restrictions merkle for a given composite hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "compositeHash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: MerkleStateInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/statements/resolutions/address",
    alias: "searchAddressResolutionStatements",
    description: "Gets an array of address resolution statements.",
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: ResolutionStatementPage,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/statements/resolutions/mosaic",
    alias: "searchMosaicResolutionStatements",
    description: "Gets an array of mosaic resolution statements.",
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: ResolutionStatementPage,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/statements/transaction",
    alias: "searchReceipts",
    description: "Gets an array of transaction statements.",
    requestFormat: "json",
    parameters: [
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "receiptType",
        type: "Query",
        schema: z.array(ReceiptTypeEnum).optional(),
      },
      {
        name: "recipientAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "senderAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "targetAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "artifactId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: TransactionStatementPage,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "put",
    path: "/transactions",
    alias: "announceTransaction",
    description: `Announces a transaction to the network.
The [catbuffer library](https://github.com/nemtech/catbuffer) defines the protocol to serialize and deserialize Symbol entities.
Catbuffers are integrated into [Symbol SDKs](https://nemtech.github.io/sdk.html). 
It&#x27;s recommended to use SDKs instead of calling the API endpoint directly to announce transactions.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ payload: z.string() }).partial().passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/confirmed",
    alias: "searchConfirmedTransactions",
    description: `Returns an array of confirmed transactions.
If a transaction was announced with an alias rather than an address, the address that will be considered when querying is the one that
was resolved from the alias at confirmation time.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "recipientAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "signerPublicKey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.array(TransactionTypeEnum).optional(),
      },
      {
        name: "embedded",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "transferMosaicId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: TransactionPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/transactions/confirmed",
    alias: "getConfirmedTransactions",
    description: "Returns confirmed transactions information for a given array of transactionIds.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: transactionIds,
      },
    ],
    response: z.array(TransactionInfoDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/confirmed/:transactionId",
    alias: "getConfirmedTransaction",
    description: "Returns confirmed transaction information given a transactionId or hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "transactionId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TransactionInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "put",
    path: "/transactions/cosignature",
    alias: "announceCosignatureTransaction",
    description: "Announces a cosignature transaction to the network.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: cosignature,
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/partial",
    alias: "searchPartialTransactions",
    description: "Returns an array of partial transactions.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "recipientAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "signerPublicKey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.array(TransactionTypeEnum).optional(),
      },
      {
        name: "embedded",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "transferMosaicId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: TransactionPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "put",
    path: "/transactions/partial",
    alias: "announcePartialTransaction",
    description: "Announces an aggregate bonded transaction to the network.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ payload: z.string() }).partial().passthrough(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/transactions/partial",
    alias: "getPartialTransactions",
    description: "Returns partial transactions information for a given array of transactionIds.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: transactionIds,
      },
    ],
    response: z.array(TransactionInfoDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/partial/:transactionId",
    alias: "getPartialTransaction",
    description: "Returns partial transaction information given a transactionId or hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "transactionId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TransactionInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/unconfirmed",
    alias: "searchUnconfirmedTransactions",
    description: "Returns an array of unconfirmed transactions.",
    requestFormat: "json",
    parameters: [
      {
        name: "address",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "recipientAddress",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "signerPublicKey",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "height",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toHeight",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "fromTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "toTransferAmount",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.array(TransactionTypeEnum).optional(),
      },
      {
        name: "embedded",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "transferMosaicId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().int().gte(10).lte(100).optional().default(10),
      },
      {
        name: "pageNumber",
        type: "Query",
        schema: z.number().int().gte(1).optional().default(1),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "order",
        type: "Query",
        schema: z.enum(["asc", "desc"]).optional().default("desc"),
      },
    ],
    response: TransactionPage,
    errors: [
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/transactions/unconfirmed",
    alias: "getUnconfirmedTransactions",
    description: "Returns unconfirmed transactions information for a given array of transactionIds.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: transactionIds,
      },
    ],
    response: z.array(TransactionInfoDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactions/unconfirmed/:transactionId",
    alias: "getUnconfirmedTransaction",
    description: "Returns unconfirmed transaction information given a transactionId or hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "transactionId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TransactionInfoDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "post",
    path: "/transactionStatus",
    alias: "getTransactionStatuses",
    description: "Returns an array of transaction statuses for a given array of transaction hashes.",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: transactionHashes,
      },
    ],
    response: z.array(TransactionStatusDTO),
    errors: [
      {
        status: 400,
        description: "InvalidContent",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
  {
    method: "get",
    path: "/transactionStatus/:hash",
    alias: "getTransactionStatus",
    description: "Returns the transaction status for a given hash.",
    requestFormat: "json",
    parameters: [
      {
        name: "hash",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: TransactionStatusDTO,
    errors: [
      {
        status: 404,
        description: "ResourceNotFound",
        schema: ModelError,
      },
      {
        status: 409,
        description: "InvalidArgument",
        schema: ModelError,
      },
    ],
  },
]);

export const api = new Zodios("https://sym-test-01.opening-line.jp:3001", endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
